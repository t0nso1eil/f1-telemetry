import { env } from "./env";

export const config = {
    serviceName: env.serviceName,
    nodeEnv: env.nodeEnv,
    logLevel: env.logLevel,
    logPretty: env.logPretty,

    kafka: {
        brokers: env.kafka.brokers,
        clientId: env.kafka.clientId,
        topicRaw: env.kafka.topicRaw,
        retries: env.kafka.retries,
    },

    f1: {
        negotiateUrl: env.f1.negotiateUrl,
        connectUrl: env.f1.connectUrl,
        hub: [{ name: "Streaming" }],
        reconnectDelayMs: env.f1.reconnectDelayMs,
    },
};