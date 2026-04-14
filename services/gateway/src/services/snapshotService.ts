import { resolveSource } from "../routing/snapshotRouter";
import { getSnapshotByDelay as getFromRedis } from "../cache/snapshotCache";
import { getSnapshotByDelay as getFromDb } from "../db/snapshotRepository";

export class SnapshotService {

    async getSnapshotForClient(delaySeconds: number, liveSnapshot: any) {
        const source = resolveSource(delaySeconds);

        console.log("using snapshot source", source);

        switch (source) {
            case "live":
                return liveSnapshot;

            case "redis":
                return await getFromRedis(delaySeconds);

            case "postgres":
                return await getFromDb(delaySeconds);

            default:
                return null;
        }
    }
}
