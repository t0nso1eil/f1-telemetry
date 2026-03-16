import { Producer } from "kafkajs"
import { kafkaConfig } from "./config"
import { RaceState } from "../domain/state/raceState"

export async function publishSnapshot(
    producer: Producer,
    state: RaceState
) {

    const serializableState = {
        ...state,
        drivers: Object.fromEntries(state.drivers)
    }

    await producer.send({
        topic: kafkaConfig.topics.snapshot,
        messages: [
            {
                key: state.sessionId,
                value: JSON.stringify(serializableState)
            }
        ]
    })
}