import express from "express";
import { checkKafka } from "./checks/kafkaCheck";
import { appLogger } from "../logger";
import { setLogLevel } from "../logger/runtimeLogLevel";
import { metricsRegistry } from "../metrics";

export function startHealthServer(port = 3100) {
    const app = express();

    app.get("/health", async (_req, res) => {
        const checks = {
            kafka: false,
        };

        try {
            checks.kafka = await checkKafka();
        } catch (e) {
            appLogger.error("Kafka health failed", { e });
        }

        const isHealthy = Object.values(checks).every(Boolean);

        res.status(isHealthy ? 200 : 503).json({
            status: isHealthy ? "ok" : "error",
            checks,
        });
    });

    app.post("/admin/log-level", express.json(), (req, res) => {
        const { level } = req.body;

        if (!level) {
            return res.status(400).json({ error: "level required" });
        }

        setLogLevel(level);

        res.json({ ok: true, level });
    });

    app.get("/metrics", async (_req, res) => {
        res.setHeader("Content-Type", metricsRegistry().contentType);
        res.end(await metricsRegistry().metrics());
    });

    app.listen(port, () => {
        appLogger.info(`Health server started on ${port}`);
    });
}
