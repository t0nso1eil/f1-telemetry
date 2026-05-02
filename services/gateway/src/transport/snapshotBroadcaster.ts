import { getClients } from "./clientRegistry";
import { SnapshotService } from "../services/snapshotService";
import { broadcastErrors } from "../metrics";
import { createLogger } from "../logger/logger";

import {
    snapshotE2ELatency,
    snapshotIngestionLatency,
    snapshotAggregatorLatency
} from "../metrics";

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
                    const now = Date.now();
                    const meta = liveSnapshot.meta;

                    if (meta?.ingestion_max) {
                        snapshotIngestionLatency.observe(
                            now - meta.ingestion_max
                        );
                    }

                    if (meta?.aggregator_max) {
                        snapshotAggregatorLatency.observe(
                            now - meta.aggregator_max
                        );
                    }

                    if (meta?.ingestion_max) {
                        snapshotE2ELatency.observe(
                            now - meta.ingestion_max
                        );
                    }

                    client.send(JSON.stringify(snap));
                }

            } catch (err) {
                broadcastErrors.inc();
                logger.error({ err }, "broadcast error");
            }
        })
    );
}
