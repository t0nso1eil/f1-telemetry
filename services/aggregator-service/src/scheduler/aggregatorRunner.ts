import { EachMessagePayload } from "kafkajs";

import { createKafkaConsumer } from "../kafka/consumer";
import { createKafkaProducer } from "../kafka/producer";
import { config } from "../config/config";

import { applyDelta } from "../domain/applyDelta";
import { createInitialState } from "../domain/state/createInitialState";
import { RaceState } from "../domain/state/raceState";

import { publishSnapshot } from "../kafka/snapshotPublisher";
import { parseNormalizedEvent } from "../parser/eventParser";

import {
    appLogger,
    kafkaLogger,
    parserLogger,
    aggregatorLogger,
} from "../logger";
import { applyDriverFallback } from "../domain/state/applyDriverFallback";
import { checkKafka } from "../health/checks/kafkaCheck";
import {
    messagesTotal,
    deltasTotal,
    driversGauge,
    processingErrors,
} from "../metrics";
import { snapshotsTotal, snapshotErrors } from "../metrics";
import { kafkaConnectionGauge } from "../metrics";

let globalDeltaSequence = 0;

async function waitForKafkaReady() {
    let retries = 10;

    while (retries > 0) {
        const ok = await checkKafka();

        if (ok) return;

        console.log("Kafka not ready, retry...");
        await new Promise(r => setTimeout(r, 3000));
        retries--;
    }

    throw new Error("Kafka not ready after retries");
}

export async function runAggregator() {
    const consumer = createKafkaConsumer();
    const producer = createKafkaProducer();

    await waitForKafkaReady();
    await consumer.connect();
    await producer.connect();

    kafkaLogger.info("Kafka connected");

    await consumer.subscribe({
        topic: config.kafka.topicRaw,
        fromBeginning: true,
    });

    let state: RaceState = createInitialState();

    let totalMessages = 0;
    let totalDeltas = 0;

    let lastKafkaState: boolean | null = null;

    appLogger.info("Aggregator started");

    // snapshot loop
    setInterval(async () => {
        try {
            const stateWithFallback = applyDriverFallback(state);

            try {
                const ok = await checkKafka();
                kafkaConnectionGauge.set(ok ? 1 : 0);
                if (lastKafkaState !== ok) {
                    kafkaLogger.warn("Kafka health changed", { ok });
                    lastKafkaState = ok;
                }
            } catch {
                kafkaConnectionGauge.set(0);
            }

            await publishSnapshot(producer, stateWithFallback);
            snapshotsTotal.inc();

            state.meta = {
                minIngestionReceivedAt: null,
                maxIngestionReceivedAt: null,
                minAggregatorReceivedAt: null,
                maxAggregatorReceivedAt: null,
            };
        } catch (err) {
            snapshotErrors.inc();
            aggregatorLogger.error("Snapshot publish error", { err });
        }
    }, config.snapshotIntervalMs);

    await consumer.run({
        eachMessage: async ({ message }: EachMessagePayload) => {
            if (!message.value) return;

            totalMessages++;
            messagesTotal.inc();
            parserLogger.debug("Message received", {
                size: message.value.length,
            });

            try {
                const raw = JSON.parse(message.value.toString());

                parserLogger.debug("Raw event", {
                    stream: raw.stream,
                });

                const deltas = parseNormalizedEvent(raw);
                totalDeltas += deltas.length;
                deltasTotal.inc(deltas.length);
                if (deltas.length > 0) {
                    aggregatorLogger.debug("Applying deltas", {
                        count: deltas.length,
                    });
                }

                for (const delta of deltas) {
                    globalDeltaSequence++;

                    state = applyDelta(state, {
                        ...delta,
                        messageId: globalDeltaSequence,
                    });
                    driversGauge.set(state.drivers.size);
                }

                if (totalMessages % 100 === 0) {
                    aggregatorLogger.info("Stats", {
                        messages: totalMessages,
                        deltas: totalDeltas,
                        drivers: state.drivers.size,
                    });
                }
            } catch (err) {
                processingErrors.inc();
                aggregatorLogger.error("Processing error", { err });
            }
        },
    });
}
