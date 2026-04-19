import { Kafka } from "kafkajs";
import { config } from "../config/config";

export function createKafkaProducer() {
    const kafka = new Kafka({
        clientId: config.kafka.clientId,
        brokers: config.kafka.brokers,

        connectionTimeout: 3000,
        requestTimeout: 30000,

        retry: {
            initialRetryTime: 300,
            retries: 10,
        },
    });

    return kafka.producer({
        allowAutoTopicCreation: false,
        idempotent: true,
        maxInFlightRequests: 5,
        retry: {
            retries: 10,
        },
    });
}
