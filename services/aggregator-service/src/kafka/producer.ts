import { Kafka } from "kafkajs"
import { kafkaConfig } from "./config"

export function createKafkaProducer() {

    const kafka = new Kafka({
        clientId: kafkaConfig.clientId,
        brokers: kafkaConfig.brokers
    })

    return kafka.producer()
}