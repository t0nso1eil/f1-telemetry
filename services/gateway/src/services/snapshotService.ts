import { resolveSource } from "../routing/snapshotRouter";
import { getSnapshotByDelay as getFromRedis } from "../cache/snapshotCache";
import { getSnapshotByDelay as getFromDb } from "../db/snapshotRepository";
import { cacheHits } from "../metrics";
import { createLogger } from "../logger/logger";

const logger = createLogger("snapshot");

export class SnapshotService {

    async getSnapshotForClient(delaySeconds: number, liveSnapshot: any) {
        const source = resolveSource(delaySeconds);

        logger.info(`Using ${source} as data source`);

        switch (source) {
            case "live":
                cacheHits.inc({ source });
                return liveSnapshot;

            case "redis":
                cacheHits.inc({ source });
                return await getFromRedis(delaySeconds);

            case "timescaledb":
                cacheHits.inc({ source });
                return await getFromDb(delaySeconds);

            default:
                return null;
        }
    }
}
