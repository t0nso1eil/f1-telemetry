import { Producer } from "kafkajs";
import { kafkaConfig } from "./config";
import { RaceState } from "../domain/state/raceState";
import { buildRaceSnapshot } from "../domain/snapshot/buildRaceSnapshot";

export async function publishSnapshot(
    producer: Producer,
    state: RaceState
) {
    const snapshot = buildRaceSnapshot(state);

    await producer.send({
        topic: kafkaConfig.topics.snapshot,
        messages: [
            {
                key: state.sessionId,
                value: JSON.stringify(snapshot)
            }
        ]
    });
}