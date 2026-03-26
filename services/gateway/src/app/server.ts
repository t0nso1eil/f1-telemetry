import { EachMessagePayload } from "kafkajs";

import { createKafkaConsumer } from "../kafka/consumer";
import { kafkaConfig } from "../kafka/config";

import { setLatestSnapshot, getLatestSnapshot } from "../kafka/liveBuffer";
import { pushSnapshot } from "../cache/snapshotCache";
import { saveSnapshot } from "../db/snapshotRepository";
import { createWSServer } from "../transport/wsServer";
import { WebSocketServer } from "ws";

function broadcast(wss: WebSocketServer, data: any) {
    const message = JSON.stringify(data);

    wss.clients.forEach((client: any) => {
        if (client.readyState === 1) {
            client.send(message);
        }
    });
}

async function start() {
    const consumer = createKafkaConsumer();

    const wss = createWSServer(3000);

    await consumer.connect();

    await consumer.subscribe({
        topic: kafkaConfig.topics.snapshot,
        fromBeginning: false
    });

    console.log("🚀 Gateway started. Waiting for snapshots...");

    // ✅ один interval, а не на каждое сообщение
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

                // 1. memory (live)
                setLatestSnapshot(snapshot);

                // 2. redis
                await pushSnapshot(snapshot);

                // 3. postgres
                await saveSnapshot(snapshot);

                broadcast(wss, snapshot);

            } catch (err) {
                console.error("❌ parse error", err);
            }
        }
    });
}

start().catch(console.error);