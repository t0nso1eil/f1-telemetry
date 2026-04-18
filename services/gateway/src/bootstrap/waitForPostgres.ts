import { Pool } from "pg";
import { env } from "../config/env";

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
            console.log("✅ Postgres ready");
            return;
        } catch (err) {
            console.log("⏳ waiting for Postgres...");
            retries--;
            await new Promise(res => setTimeout(res, 2000));
        }
    }

    throw new Error("Postgres not available");
}
