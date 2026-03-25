import { env } from "./env";

export const config = {
    serviceName: env.serviceName,
    nodeEnv: env.nodeEnv,
    logLevel: env.logLevel,
    logPretty: env.logPretty,

    kafka: env.kafka,
    snapshotIntervalMs: env.snapshotIntervalMs,
};