import { getClients } from "./clientRegistry";
import { SnapshotService } from "../services/snapshotService";
import { broadcastErrors } from "../metrics";
import { createLogger } from "../logger/logger";

import {
    snapshotE2ELatency,
    snapshotIngestionLatency,
    snapshotAggregatorLatency,
    snapshotE2ELatencyGauge
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
                    const mode = state.delaySeconds > 0 ? "delayed" : "live"

                    if (meta?.ingestion_max) {
                        const ingestionTs = Date.parse(meta.ingestion_max);

                        if (!Number.isNaN(ingestionTs)) {
                            snapshotIngestionLatency.observe(
                                now - ingestionTs
                            );
                        }
                    }

                    if (meta?.aggregator_max) {
                        const aggregatorTs = Date.parse(meta.aggregator_max);

                        if (!Number.isNaN(aggregatorTs)) {
                            snapshotAggregatorLatency.observe(
                                now - aggregatorTs
                            );
                        }
                    }

                    if (meta?.ingestion_max) {
                        const ingestionTs = Date.parse(meta.ingestion_max);

                        if (!Number.isNaN(ingestionTs)) {
                            const latency = now - ingestionTs
                            snapshotE2ELatency.observe(
                                { mode: mode },
                                latency
                            );
                            snapshotE2ELatencyGauge.set(
                                { mode: mode },
                                latency
                            );
                        }
                    }

                    // logger.info({
                    //     now: new Date().toISOString(),
                    //     ingestion_max: meta.ingestion_max,
                    //     aggregator_max: meta.aggregator_max
                    // }, "latency debug");

                    client.send(JSON.stringify(snap));
                }

            } catch (err) {
                broadcastErrors.inc();
                logger.error({ err }, "broadcast error");
            }
        })
    );
}
