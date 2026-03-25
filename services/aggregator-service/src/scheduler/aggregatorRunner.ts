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

let globalDeltaSequence = 0;

export async function runAggregator() {
    const consumer = createKafkaConsumer();
    const producer = createKafkaProducer();

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

    appLogger.info("Aggregator started");

    // snapshot loop
    setInterval(async () => {
        try {
            await publishSnapshot(producer, state);
        } catch (err) {
            aggregatorLogger.error("Snapshot publish error", { err });
        }
    }, config.snapshotIntervalMs);

    await consumer.run({
        eachMessage: async ({ message }: EachMessagePayload) => {
            if (!message.value) return;

            totalMessages++;

            try {
                const raw = JSON.parse(message.value.toString());

                parserLogger.debug("Raw event", {
                    stream: raw.stream,
                });

                const deltas = parseNormalizedEvent(raw);
                totalDeltas += deltas.length;

                for (const delta of deltas) {
                    globalDeltaSequence++;

                    state = applyDelta(state, {
                        ...delta,
                        messageId: globalDeltaSequence,
                    });
                }

                if (totalMessages % 100 === 0) {
                    aggregatorLogger.info("Stats", {
                        messages: totalMessages,
                        deltas: totalDeltas,
                        drivers: state.drivers.size,
                    });
                }
            } catch (err) {
                aggregatorLogger.error("Processing error", { err });
            }
        },
    });
}