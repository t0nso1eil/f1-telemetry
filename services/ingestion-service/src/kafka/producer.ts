import { Kafka, Producer } from "kafkajs";
import { config } from "../config";

export class KafkaProducer {
    private producer: Producer;

    constructor() {
        const kafka = new Kafka({
            clientId: config.kafka.clientId,
            brokers: config.kafka.brokers
        });

        this.producer = kafka.producer();
    }

    async connect() {
        await this.producer.connect();
        console.log("✅ Kafka connected");
    }

    async publish(message: unknown) {
        await this.producer.send({
            topic: config.kafka.topic,
            messages: [
                {
                    key: Date.now().toString(),
                    value: JSON.stringify(message)
                }
            ]
        });
    }
}