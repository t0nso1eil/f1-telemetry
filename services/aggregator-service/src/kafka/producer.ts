import { Kafka } from "kafkajs";
import { config } from "../config/config";

export function createKafkaProducer() {
    const kafka = new Kafka({
        clientId: config.kafka.clientId,
        brokers: config.kafka.brokers,
    });

    return kafka.producer();
}