import 'dotenv/config';

import { runAggregator } from "./scheduler/aggregatorRunner";
import { appLogger } from "./logger";

async function bootstrap() {
    const shutdown = async (signal: string) => {
        appLogger.warn("Shutdown signal", { signal });
        process.exit(0);
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);

    try {
        await runAggregator();
    } catch (err) {
        appLogger.error("Startup failed", { err });
        process.exit(1);
    }
}

bootstrap();