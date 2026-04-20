import express from "express";
import { metricsRegistry } from "../metrics";

export function startMetricsServer(port: number) {
    const app = express();

    app.get("/metrics", async (_, res) => {
        res.set("Content-Type", metricsRegistry().contentType);
        res.end(await metricsRegistry().metrics());
    });

    app.listen(port, () => {
        console.log(`Metrics server on ${port}`);
    });
}
