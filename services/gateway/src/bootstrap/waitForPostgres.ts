import { Pool } from "pg";
import { env } from "../config/env";
import { createLogger } from "../logger/logger";

const logger = createLogger("bootstrap");

const pool = new Pool({
    host: env.postgres.host,
    port: env.postgres.port,
    user: env.postgres.user,
    password: env.postgres.password,
    database: env.postgres.database,
});

export async function waitForPostgres() {
    let retries = 10;

    while (retries) {
        try {
            await pool.query("SELECT 1");
            logger.info("Postgres ready");
            return;
        } catch (err) {
            logger.warn("Waiting for Postgres...");
            retries--;
            await new Promise(res => setTimeout(res, 2000));
        }
    }

    throw new Error("Postgres not available");
}
