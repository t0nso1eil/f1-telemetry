import { Kafka } from "kafkajs";
import { config } from "../../config/config";

export async function checkKafka(): Promise<boolean> {
    const kafka = new Kafka({
        clientId: "healthcheck",
        brokers: config.kafka.brokers,
    });

    const admin = kafka.admin();

    try {
        await admin.connect();

        const topics = await admin.listTopics();

        const required = [
            config.kafka.topicRaw,
            config.kafka.topicSnapshot,
        ];

        const allExist = required.every(t => topics.includes(t));

        return allExist;
    } catch {
        return false;
    } finally {
        await admin.disconnect().catch(() => {});
    }
}
