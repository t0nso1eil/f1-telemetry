import { resolveSource } from "../routing/snapshotRouter";
import { getLatestSnapshot } from "../kafka/liveBuffer";
import { getSnapshotByDelay as getFromRedis } from "../cache/snapshotCache";
import { getSnapshotByDelay as getFromDb } from "../db/snapshotRepository";

export class SnapshotService {

    async getSnapshotByTime(targetTime: number) {
        const now = Date.now();
        const delaySeconds = (now - targetTime) / 1000;

        const source = resolveSource(delaySeconds);

        console.log("using snapshot source", source);

        switch (source) {
            case "live":
                return getLatestSnapshot();

            case "redis":
                return await getFromRedis(delaySeconds);

            case "postgres":
                return await getFromDb(delaySeconds);

            default:
                return null;
        }
    }
}
