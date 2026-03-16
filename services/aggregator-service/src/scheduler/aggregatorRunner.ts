import { createKafkaConsumer } from "../kafka/consumer"
import { createKafkaProducer } from "../kafka/producer"
import { kafkaConfig } from "../kafka/config"

import { applyDelta } from "../domain/applyDelta"
import { createInitialState } from "../domain/state/createInitialState"

import { RaceState } from "../domain/state/raceState"
import { publishSnapshot } from "../kafka/snapshotPublisher"
import {parseNormalizedEvent} from "../parser/eventParser";
import {parserLogger} from "../logger/logger";

export async function runAggregator() {

    const consumer = createKafkaConsumer()
    const producer = createKafkaProducer()

    await consumer.connect()
    await producer.connect()

    await consumer.subscribe({
        topic: kafkaConfig.topics.raw,
        fromBeginning: false
    })

    let state: RaceState = createInitialState()

    let totalMessages = 0
    let totalDeltas = 0

    console.log("🚀 Aggregator started")

    setInterval(async () => {

        try {

            await publishSnapshot(producer, state)

            console.log(
                "📡 snapshot published",
                "drivers:", state.drivers.size,
                "lap:", state.timing.currentLap,
                "track:", state.track.status
            )

        } catch (err) {

            console.error("❌ snapshot publish error", err)

        }

    }, 2000)

    await consumer.run({

        eachMessage: async ({ message }) => {

            if (!message.value) return

            totalMessages++

            try {

                const raw = JSON.parse(
                    message.value.toString()
                )

                parserLogger.debug({
                    message: "raw event received",
                    stream: raw.stream,
                    payload: raw.payload
                })

                const deltas = parseNormalizedEvent(raw)

                if (deltas.length === 0) {
                    console.log("no deltas for stream", raw.stream)
                }
                
                totalDeltas += deltas.length

                // debug
                if (deltas.length > 0) {

                    const types = deltas.map(d => d.type)

                    console.log(
                        "📥 message",
                        totalMessages,
                        "deltas:",
                        deltas.length,
                        types
                    )
                }

                for (const delta of deltas) {

                    state = applyDelta(state, delta)

                }

                // периодическая статистика
                if (totalMessages % 100 === 0) {

                    console.log(
                        "📊 stats",
                        "messages:", totalMessages,
                        "deltas:", totalDeltas,
                        "drivers:", state.drivers.size
                    )

                }

            } catch (err) {

                console.error("❌ Aggregator error", err)

            }

        }
    })
}
