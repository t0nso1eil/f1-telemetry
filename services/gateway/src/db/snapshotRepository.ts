import { pg } from "./postgresClient";

export async function saveSnapshot(snapshot: any) {
    const query = `
        INSERT INTO snapshots (created_at, data)
        VALUES ($1, $2)
    `;

    const createdAt =
        snapshot.generated_at
            ? new Date(snapshot.generated_at)
            : new Date();

    await pg.query(query, [
        createdAt,
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

    console.log("get snapshot from db", result);

    if (result.rows.length === 0) return null;

    return result.rows[0].data;
}
