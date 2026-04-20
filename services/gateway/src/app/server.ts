import { EachMessagePayload } from "kafkajs";

import { createKafkaConsumer } from "../kafka/consumer";
import { kafkaConfig } from "../kafka/config";

import { setLatestSnapshot } from "../kafka/liveBuffer";
import { pushSnapshot } from "../cache/snapshotCache";
import { saveSnapshot } from "../db/snapshotRepository";
import { createWSServer } from "../transport/wsServer";
import { broadcastSnapshot } from "../transport/snapshotBroadcaster";
import { waitForDependencies } from "../bootstrap/waitForDependencies";
import { snapshotsReceived } from "../metrics";
import { startMetricsServer } from "./metricsServer";
import { env } from "../config/env";
import { createLogger } from "../logger/logger";

const logger = createLogger("app");

async function start() {
    await waitForDependencies();
    startMetricsServer(env.metrics_port || 3002);

    const consumer = createKafkaConsumer();
    createWSServer();
    await consumer.connect();
    await consumer.subscribe({
        topic: kafkaConfig.topics.snapshot,
        fromBeginning: false
    });

    logger.info("Gateway started. Waiting for snapshots...");

    await consumer.run({
        eachMessage: async ({ message }: EachMessagePayload) => {
            if (!message.value) return;

            try {
                const snapshot = JSON.parse(message.value.toString());

                logger.info({
                    drivers: snapshot.drivers?.length || 0,
                    timestamp: snapshot.generated_at
                }, "snapshot received");
                snapshotsReceived.inc();

                setLatestSnapshot(snapshot);

                await pushSnapshot(snapshot);
                await saveSnapshot(snapshot);

                await broadcastSnapshot(snapshot);

            } catch (err) {
                logger.error({ err }, "processing error");
            }
        }
    });
}

start().catch(logger.error);
