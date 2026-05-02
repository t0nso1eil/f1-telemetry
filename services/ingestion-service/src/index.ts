import 'dotenv/config';

import { IngestionApp } from "./app/app";
import { appLogger } from "./logger";

async function bootstrap(): Promise<void> {
    const app = new IngestionApp();

    const shutdown = async (signal: string) => {
        appLogger.warn("Shutdown signal received", { signal });

        try {
            await app.stop();
            process.exit(0);
        } catch (error) {
            appLogger.error("Shutdown failed", { error });
            process.exit(1);
        }
    };

    process.on("SIGINT", () => void shutdown("SIGINT"));
    process.on("SIGTERM", () => void shutdown("SIGTERM"));

    try {
        await app.start();
    } catch (error) {
        appLogger.error("Application startup failed", { error });
        process.exit(1);
    }
}

void bootstrap();
