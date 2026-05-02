import { Kafka, Producer } from "kafkajs";
import { config } from "../config/config";
import { kafkaLogger } from "../logger";
import {NormalizedEvent} from "../types/normalized-event";

export class KafkaProducer {
    private producer: Producer;

    constructor() {
        const kafka = new Kafka({
            clientId: config.kafka.clientId,
            brokers: config.kafka.brokers,
        });

        this.producer = kafka.producer({
            idempotent: true,
            maxInFlightRequests: 5,
            retry: {
                retries: config.kafka.retries,
            },
        });
    }

    async connect(): Promise<void> {
        await this.producer.connect();

        kafkaLogger.info("Kafka producer connected", {
            brokers: config.kafka.brokers,
            clientId: config.kafka.clientId,
        });
    }

    async disconnect(): Promise<void> {
        await this.producer.disconnect();
        kafkaLogger.info("Kafka producer disconnected");
    }

    async publish(message: NormalizedEvent): Promise<void> {
        await this.producer.send({
            topic: config.kafka.topicRaw,
            messages: [
                {
                    key: Date.now().toString(),
                    value: JSON.stringify(message),

                    headers: {
                        eventId: message.eventId,
                        sourceReceivedAt: message.sourceReceivedAt.toString(),
                    },
                },
            ],
        });
    }
}
