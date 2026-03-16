import winston from "winston"
import DailyRotateFile from "winston-daily-rotate-file"
import path from "path"
import fs from "fs"

function ensureDir(dir: string) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
    }
}

export function createModuleLogger(service: string, module: string) {

    const date = new Date().toISOString().slice(0, 10)

    const baseDir = path.join(
        process.cwd(),
        "logs",
        service,
        date
    )

    ensureDir(baseDir)

    const filePath = path.join(baseDir, `${module}.log`)

    return winston.createLogger({

        level: "debug",

        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
        ),

        transports: [

            new winston.transports.Console({
                level: "debug",
                format: winston.format.simple()
            }),

            new DailyRotateFile({
                filename: filePath,
                level: "debug",
                maxSize: "50m",
                maxFiles: "7d"
            })

        ]

    })
}