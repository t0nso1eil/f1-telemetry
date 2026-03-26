import { Pool } from "pg";

export const pg = new Pool({
    host: "localhost",
    port: 5433,
    user: "f1",
    password: "f1",
    database: "telemetry"
});