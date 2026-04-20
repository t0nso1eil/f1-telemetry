import { waitForKafka } from "./waitForKafka";
import { waitForPostgres } from "./waitForPostgres";
import { waitForRedis } from "./waitForRedis";
import { createLogger } from "../logger/logger";

const logger = createLogger("bootstrap");

export async function waitForDependencies() {
    logger.warn("Checking dependencies...");

    await retry(waitForKafka, "kafka");
    await retry(waitForPostgres, "postgres");
    await retry(waitForRedis, "redis");

    logger.info("All dependencies are ready");
}

async function retry(fn: () => Promise<void>, name: string) {
    let retries = 10;

    while (retries > 0) {
        try {
            await fn();
            logger.info(`${name} ready`);
            return;
        } catch (e) {
            logger.warn(`${name} not ready, retrying...`);
            await new Promise(r => setTimeout(r, 2000));
            retries--;
        }
    }

    throw new Error(`${name} failed`);
}
