import { config } from "../config/config";
import { appLogger, kafkaLogger, parserLogger, aggregatorLogger, snapshotLogger } from "./index";

const allLoggers = [
    appLogger,
    kafkaLogger,
    parserLogger,
    aggregatorLogger,
    snapshotLogger,
];

export function setLogLevel(level: string) {
    for (const logger of allLoggers) {
        logger.level = level;
    }

    config.logLevel = level as any;

    appLogger.warn("Log level changed", { level });
}
