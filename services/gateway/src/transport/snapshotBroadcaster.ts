import { getClients } from "./clientRegistry";
import { SnapshotService } from "../services/snapshotService";
import { broadcastErrors } from "../metrics";
import {createLogger} from "../logger/logger";

const logger = createLogger("broadcast");

const snapshotService = new SnapshotService();

export async function broadcastSnapshot(liveSnapshot: any) {
    const clients = getClients();

    await Promise.all(
        Array.from(clients.entries()).map(async ([client, state]) => {
            if (client.readyState !== 1) return;

            try {
                const snap = await snapshotService.getSnapshotForClient(
                    state.delaySeconds,
                    liveSnapshot
                );

                if (snap) {
                    client.send(JSON.stringify(snap));
                }

            } catch (err) {
                broadcastErrors.inc();
                logger.error({ err }, "broadcast error");
            }
        })
    );
}
