import { Kafka } from "kafkajs";
import { config } from "../config/config";
import { kafkaLogger } from "../logger";

export function createKafkaConsumer() {
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

    const consumer = kafka.consumer({
        groupId: config.kafka.consumerGroup,
    });

    kafkaLogger.info("Kafka consumer created", {
        brokers: config.kafka.brokers,
    });

    consumer.on(consumer.events.CONNECT, () => {
        kafkaLogger.info("Consumer connected");
    });

    consumer.on(consumer.events.DISCONNECT, () => {
        kafkaLogger.warn("Consumer disconnected");
    });

    consumer.on(consumer.events.GROUP_JOIN, (e) => {
        kafkaLogger.info("Consumer group joined", {
            memberId: e.payload.memberId,
            groupId: e.payload.groupId,
            leader: e.payload.isLeader,
        });
    });

    consumer.on(consumer.events.CRASH, (e) => {
        kafkaLogger.error("Consumer crash", {
            error: e.payload.error,
        });
    });

    return consumer;
}
