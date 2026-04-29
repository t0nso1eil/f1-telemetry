import { pg } from "./postgresClient";
import { createLogger } from "../logger/logger";

const logger = createLogger("timescaledb");


export async function saveSnapshot(snapshot: any) {
    const query = `
        INSERT INTO snapshots (created_at, data)
        VALUES ($1, $2)
    `;

    try {
        const createdAt =
            snapshot.generated_at
                ? new Date(snapshot.generated_at)
                : new Date();

        await pg.query(query, [createdAt, snapshot]);

    } catch (err) {
        logger.error({ err }, "Failed to save snapshot");
    }
}


export async function getSnapshotByDelay(delaySeconds: number) {
    const query = `
        SELECT data
        FROM snapshots
        WHERE created_at <= NOW() - ($1 * INTERVAL '1 second')
        ORDER BY created_at DESC
            LIMIT 1
    `;

    try {
        const result = await pg.query(query, [delaySeconds]);

        if (result.rows.length === 0) {
            logger.warn({ delaySeconds }, "No snapshot found for delay");
            return null;
        }

        const snapshot = result.rows[0].data;

        logger.debug(
            {
                delaySeconds,
                timestamp: snapshot?.generated_at
            },
            "Snapshot loaded from DB"
        );

        return snapshot;

    } catch (err) {
        logger.error({ err, delaySeconds }, "Failed to get snapshot");
        return null;
    }
}
