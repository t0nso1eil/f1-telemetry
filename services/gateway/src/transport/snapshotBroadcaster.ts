import { getClients } from "./clientRegistry";
import { SnapshotService } from "../services/snapshotService";

const snapshotService = new SnapshotService();

export async function broadcastSnapshots() {
    const clients = getClients();

    for (const [client, state] of clients.entries()) {
        if (client.readyState !== 1) continue;

        try {
            const snap = await snapshotService.getSnapshotByTime(state.cursorTime);

            if (snap) {
                client.send(JSON.stringify(snap));

                state.cursorTime += 2000; // interval_ms
            }

        } catch (err) {
            console.error("❌ broadcast error", err);
        }
    }
}