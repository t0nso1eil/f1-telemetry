import { env } from "../config/env";

export const kafkaConfig = {
    clientId: env.kafka.clientId,
    brokers: env.kafka.brokers,
    topics: {
        snapshot: "telemetry.snapshot"
    },
    consumerGroup: env.kafka.groupId
};