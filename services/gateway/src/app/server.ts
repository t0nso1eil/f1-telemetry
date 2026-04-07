import { EachMessagePayload } from "kafkajs";

import { createKafkaConsumer } from "../kafka/consumer";
import { kafkaConfig } from "../kafka/config";

import { setLatestSnapshot, getLatestSnapshot } from "../kafka/liveBuffer";
import { pushSnapshot } from "../cache/snapshotCache";
import { saveSnapshot } from "../db/snapshotRepository";
import { createWSServer } from "../transport/wsServer";
import { broadcastSnapshots } from "../transport/snapshotBroadcaster";

async function start() {
    const consumer = createKafkaConsumer();

    const wss = createWSServer();

    await consumer.connect();

    await consumer.subscribe({
        topic: kafkaConfig.topics.snapshot,
        fromBeginning: false
    });

    console.log("🚀 Gateway started. Waiting for snapshots...");

    setInterval(() => {
        const snap = getLatestSnapshot();

        if (snap) {
            console.log("🔥 live buffer works", snap.timestamp);
        }
    }, 5000);

    await consumer.run({
        eachMessage: async ({ message }: EachMessagePayload) => {
            if (!message.value) return;

            try {
                const snapshot = JSON.parse(message.value.toString());

                console.log(
                    "📡 snapshot received",
                    "drivers:", snapshot.drivers?.length || 0,
                    "timestamp:", snapshot.timestamp
                );

                setLatestSnapshot(snapshot);

                await pushSnapshot(snapshot);

                await saveSnapshot(snapshot);

                await broadcastSnapshots();

            } catch (err) {
                console.error("❌ parse error", err);
            }
        }
    });
}

start().catch(console.error);