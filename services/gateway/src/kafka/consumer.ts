import { Kafka } from "kafkajs";
import { kafkaConfig } from "./config";

export function createKafkaConsumer() {
    const kafka = new Kafka({
        clientId: kafkaConfig.clientId,
        brokers: kafkaConfig.brokers
    });

    return kafka.consumer({
        groupId: kafkaConfig.consumerGroup
    });
}