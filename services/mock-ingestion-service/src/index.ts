import { appLogger } from "./logger";
import { MockIngestionApp } from "./app/mock.app";

async function bootstrap(): Promise<void> {
    const app = new MockIngestionApp();

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
