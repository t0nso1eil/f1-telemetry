import { Kafka } from "kafkajs"
import { kafkaConfig } from "./config"

export function createKafkaConsumer() {

    const kafka = new Kafka({
        clientId: kafkaConfig.clientId,
        brokers: kafkaConfig.brokers
    })

    const consumer = kafka.consumer({
        groupId: kafkaConfig.consumerGroup
    })

    return consumer
}