import { createKafkaConsumer } from "../kafka/consumer";
import { createKafkaProducer } from "../kafka/producer";
import { kafkaConfig } from "../kafka/config";

import { applyDelta } from "../domain/applyDelta";
import { createInitialState } from "../domain/state/createInitialState";
import { RaceState } from "../domain/state/raceState";

import { publishSnapshot } from "../kafka/snapshotPublisher";
import { parseNormalizedEvent } from "../parser/eventParser";
import { parserLogger } from "../logger/logger";

let globalDeltaSequence = 0;

export async function runAggregator() {
    const consumer = createKafkaConsumer();
    const producer = createKafkaProducer();

    await consumer.connect();
    await producer.connect();

    await consumer.subscribe({
        topic: kafkaConfig.topics.raw,
        fromBeginning: true
    });

    let state: RaceState = createInitialState();

    let totalMessages = 0;
    let totalDeltas = 0;

    console.log("🚀 Aggregator started");

    setInterval(async () => {
        try {
            await publishSnapshot(producer, state);

            console.log(
                "📡 snapshot published",
                "drivers:", state.drivers.size,
                "track:", state.raceStatus.trackStatus,
                "session:", state.raceStatus.sessionStatus,
                "raceControl:", state.raceControlMessages.length,
                "teamRadio:", state.teamRadio.length
            );
        } catch (err) {
            console.error("❌ snapshot publish error", err);
        }
    }, 2000);

    await consumer.run({
        eachMessage: async ({ message }) => {
            if (!message.value) return;

            totalMessages++;

            try {
                const raw = JSON.parse(message.value.toString());

                parserLogger.debug({
                    message: "raw event received",
                    stream: raw.stream,
                    timestamp: raw.timestamp
                });

                const deltas = parseNormalizedEvent(raw);

                totalDeltas += deltas.length;

                if (deltas.length > 0) {
                    console.log(
                        "📥 message",
                        totalMessages,
                        "stream:", raw.stream,
                        "deltas:", deltas.length,
                        deltas.map((d) => d.type)
                    );
                }

                for (const delta of deltas) {
                    globalDeltaSequence++;
                    state = applyDelta(state, {
                        ...delta,
                        messageId: globalDeltaSequence
                    });
                }

                if (totalMessages % 100 === 0) {
                    console.log(
                        "📊 stats",
                        "messages:", totalMessages,
                        "deltas:", totalDeltas,
                        "drivers:", state.drivers.size,
                        "raceControl:", state.raceControlMessages.length,
                        "teamRadio:", state.teamRadio.length
                    );
                }
            } catch (err) {
                console.error("❌ Aggregator error", err);
            }
        }
    });
}