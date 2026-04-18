import Redis from "ioredis";
import { env } from "../config/env";

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

            console.log("✅ Redis ready");

            await client.quit();
            return;

        } catch (err) {
            console.log("⏳ waiting for Redis...");
            retries--;
            await new Promise(res => setTimeout(res, 2000));
        }
    }

    throw new Error("Redis not available");
}
