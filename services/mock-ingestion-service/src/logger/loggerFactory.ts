import winston from "winston";
import { config } from "../config/config";

export function createModuleLogger(module: string) {
    const jsonFormat = winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    );

    const prettyFormat = winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
            const rest = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : "";
            return `${timestamp} [${level}] [${config.serviceName}:${module}] ${message}${rest}`;
        })
    );

    return winston.createLogger({
        level: config.logLevel,
        defaultMeta: {
            service: config.serviceName,
            module,
            env: config.nodeEnv,
        },
        format: config.logPretty ? prettyFormat : jsonFormat,
        transports: [new winston.transports.Console()],
    });
}