import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";
import fs from "fs";
import { config } from "../config/config";

function getLogDir() {
    const date = new Date().toISOString().split("T")[0];
    const dir = path.join(process.cwd(), "logs", date);

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    return dir;
}

export function createModuleLogger(module: string) {
    const logDir = getLogDir();

    const fileTransport = new DailyRotateFile({
        dirname: logDir,
        filename: `${module}-%DATE%.log`,
        datePattern: "YYYY-MM-DD",
        maxFiles: "7d",
        zippedArchive: false,
    });

    const consoleFormat = winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
            const rest = Object.keys(meta).length ? JSON.stringify(meta) : "";
            return `${timestamp} [${level}] [${config.serviceName}:${module}] ${message} ${rest}`;
        })
    );

    const jsonFormat = winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    );

    return winston.createLogger({
        level: config.logLevel,
        format: config.logPretty ? consoleFormat : jsonFormat,
        transports: [
            new winston.transports.Console(),
            fileTransport,
        ],
        defaultMeta: {
            service: config.serviceName,
            module,
        },
    });
}