import { Kafka } from "kafkajs";
import { config } from "../config/config";
import { kafkaLogger } from "../logger";

export function createKafkaConsumer() {
    const kafka = new Kafka({
        clientId: config.kafka.clientId,
        brokers: config.kafka.brokers,
    });

    const consumer = kafka.consumer({
        groupId: config.kafka.consumerGroup,
    });

    kafkaLogger.info("Kafka consumer created", {
        brokers: config.kafka.brokers,
    });

    return consumer;
}