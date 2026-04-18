import { Kafka } from "kafkajs";
import { env } from "../config/env";

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

            console.log("✅ Kafka ready");

            await admin.disconnect();
            return;

        } catch (err) {
            console.log("⏳ waiting for Kafka...");
            retries--;
            await new Promise(res => setTimeout(res, 2000));
        }
    }

    throw new Error("Kafka not available");
}
