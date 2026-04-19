import { Producer } from "kafkajs";
import { config } from "../config/config";
import { RaceState } from "../domain/state/raceState";
import { buildRaceSnapshot } from "../domain/snapshot/buildRaceSnapshot";
import { snapshotLogger } from "../logger";
import {snapshotSizeBytes} from "../metrics";

export async function publishSnapshot(
    producer: Producer,
    state: RaceState
) {
    snapshotLogger.debug("Snapshot building", {
        drivers: state.drivers.size,
        sessionId: state.sessionId,
    });
    const snapshot = buildRaceSnapshot(state);
    const payload = JSON.stringify(snapshot);
    snapshotSizeBytes.observe(Buffer.byteLength(payload));

    await producer.send({
        topic: config.kafka.topicSnapshot,
        acks: -1,
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
