import { redis } from "./redisClient";

const KEY = "race:snapshots";
const MAX_LENGTH = 1000;

export async function pushSnapshot(snapshot: any) {
    const value = JSON.stringify(snapshot);

    await redis.rpush(KEY, value);
    await redis.ltrim(KEY, -MAX_LENGTH, -1);
}

export async function getSnapshotByDelay(delaySeconds: number) {
    const indexFromEnd = Math.floor(delaySeconds / 2);

    const result = await redis.lindex(KEY, -1 - indexFromEnd);

    console.log("get snapshot from cache", result);

    if (!result) return null;

    return JSON.parse(result);
}
