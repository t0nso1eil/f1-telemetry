import { resolveSource } from "../routing/snapshotRouter";
import { getLatestSnapshot } from "../kafka/liveBuffer";
import { getSnapshotByDelay as getFromRedis } from "../cache/snapshotCache";
import { getSnapshotByDelay as getFromDb } from "../db/snapshotRepository";

export class SnapshotService {

    async getSnapshot(delaySeconds: number) {
        const source = resolveSource(delaySeconds);

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