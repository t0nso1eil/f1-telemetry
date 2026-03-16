import winston from "winston"
import DailyRotateFile from "winston-daily-rotate-file"
import path from "path"
import fs from "fs"

function ensureDir(dir: string) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
    }
}

export function createModuleLogger(
    service: string,
    module: string
) {

    const date = new Date().toISOString().slice(0, 10)

    const baseDir = path.join(
        process.cwd(),
        "logs",
        date,
        service
    )

    ensureDir(baseDir)

    const filePath = path.join(baseDir, `${module}.log`)

    const logger = winston.createLogger({

        level: "info",

        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
        ),

        transports: [

            new winston.transports.Console({
                format: winston.format.simple()
            }),

            new DailyRotateFile({
                filename: filePath,
                datePattern: "YYYY-MM-DD",
                maxSize: "20m",
                maxFiles: "14d"
            })

        ]

    })

    return logger
}