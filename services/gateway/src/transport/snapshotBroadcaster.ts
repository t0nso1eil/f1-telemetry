import { getClients } from "./clientRegistry";
import { SnapshotService } from "../services/snapshotService";

const snapshotService = new SnapshotService();

export async function broadcastSnapshots() {
    const clients = getClients();

    for (const [client, state] of clients.entries()) {
        if (client.readyState !== 1) continue;

        try {
            const snap = await snapshotService.getSnapshot(state.delaySeconds);

            if (snap) {
                client.send(JSON.stringify(snap));
            }

        } catch (err) {
            console.error("❌ broadcast error", err);
        }
    }
}