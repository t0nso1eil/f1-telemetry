import Redis from "ioredis";
import { env } from "../config/env";
import { createLogger } from "../logger/logger";

const logger = createLogger("bootstrap");

export async function waitForRedis() {
    const client = new Redis({
        host: env.redis.host,
        port: env.redis.port,
        lazyConnect: true
    });

    let retries = 10;

    while (retries) {
        try {
            await client.connect();
            await client.ping();

            logger.info("Redis ready");

            await client.quit();
            return;

        } catch (err) {
            logger.warn("Waiting for Redis...");
            retries--;
            await new Promise(res => setTimeout(res, 2000));
        }
    }

    throw new Error("Redis not available");
}
