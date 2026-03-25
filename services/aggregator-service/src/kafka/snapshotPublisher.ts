import { Producer } from "kafkajs";
import { config } from "../config/config";
import { RaceState } from "../domain/state/raceState";
import { buildRaceSnapshot } from "../domain/snapshot/buildRaceSnapshot";
import { snapshotLogger } from "../logger";

export async function publishSnapshot(
    producer: Producer,
    state: RaceState
) {
    const snapshot = buildRaceSnapshot(state);

    await producer.send({
        topic: config.kafka.topicSnapshot,
        messages: [
            {
                key: state.sessionId,
                value: JSON.stringify(snapshot),
            },
        ],
    });

    snapshotLogger.info("Snapshot published", {
        drivers: state.drivers.size,
    });
}