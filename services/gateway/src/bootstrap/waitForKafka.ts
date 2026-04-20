import { Kafka } from "kafkajs";
import { env } from "../config/env";
import { createLogger } from "../logger/logger";

const logger = createLogger("bootstrap");

export async function waitForKafka() {
    const kafka = new Kafka({
        clientId: env.kafka.clientId,
        brokers: env.kafka.brokers
    });

    const admin = kafka.admin();

    let retries = 10;

    while (retries) {
        try {
            await admin.connect();
            await admin.listTopics();

            logger.info("Kafka ready");

            await admin.disconnect();
            return;

        } catch (err) {
            logger.warn("Waiting for Kafka...");
            retries--;
            await new Promise(res => setTimeout(res, 2000));
        }
    }

    throw new Error("Kafka not available");
}
