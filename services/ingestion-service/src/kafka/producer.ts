import { Kafka, Producer } from "kafkajs";
import { config } from "../config";

export class KafkaProducer {
    private producer: Producer;

    constructor() {
        const kafka = new Kafka({
            clientId: "ingestion-service",
            brokers: [
                "localhost:9092",
                "localhost:9093",
                "localhost:9094"
            ]
        })

        this.producer = kafka.producer({
            //acks: -1,                 // acks=all
            idempotent: true,         // защита от дублей
            maxInFlightRequests: 5,   // безопасно для idempotent
            retry: {
                retries: 10
            }
        });
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