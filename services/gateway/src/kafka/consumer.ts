import { Kafka } from "kafkajs";
import { kafkaConfig } from "./config";
import { kafkaConnectionGauge } from "../metrics";
import { createLogger } from "../logger/logger";

const logger = createLogger("kafka");

export function createKafkaConsumer() {
    const kafka = new Kafka({
        clientId: kafkaConfig.clientId,
        brokers: kafkaConfig.brokers,
        connectionTimeout: 3000,
        retry: {
            retries: 10,
            initialRetryTime: 300
        }
    });

    const consumer = kafka.consumer({
        groupId: kafkaConfig.consumerGroup,
    });

    consumer.on(consumer.events.CONNECT, () => {
        kafkaConnectionGauge.set(1);
        logger.info("Kafka connected");
    });

    consumer.on(consumer.events.DISCONNECT, () => {
        kafkaConnectionGauge.set(0);
        logger.warn("Kafka disconnected");
    });

    consumer.on(consumer.events.CRASH, (e) => {
        logger.error(e.payload.error, "Kafka crash");
    });

    return consumer;
}
