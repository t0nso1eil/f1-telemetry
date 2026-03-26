import { pg } from "./postgresClient";

export async function saveSnapshot(snapshot: any) {
    const query = `
        INSERT INTO snapshots (created_at, data)
        VALUES ($1, $2)
    `;

    await pg.query(query, [
        new Date(snapshot.timestamp),
        snapshot
    ]);
}

export async function getSnapshotByDelay(delaySeconds: number) {
    const query = `
        SELECT data
        FROM snapshots
        ORDER BY created_at DESC
        OFFSET $1
        LIMIT 1
    `;

    const offset = Math.floor(delaySeconds / 2);

    const result = await pg.query(query, [offset]);

    if (result.rows.length === 0) return null;

    return result.rows[0].data;
}