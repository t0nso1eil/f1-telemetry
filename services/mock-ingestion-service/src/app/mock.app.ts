import { KafkaProducer } from "../kafka/producer";
import { MockF1Client } from "../mock/mock.f1.client";
import { TelemetryNormalizer } from "../normalizer/telemetry.normalizer";
import { appLogger } from "../logger";
import {F1Parser} from "../parser/f1.parser";

export class MockIngestionApp {
    private kafka = new KafkaProducer();
    private f1 = new MockF1Client();
    private parser = new F1Parser();
    private normalizer = new TelemetryNormalizer();

    async start(): Promise<void> {
        await this.kafka.connect();

        await this.f1.start(async (rawMessage) => {
            const parsedEvents = this.parser.parse(rawMessage.data);

            for (const event of parsedEvents) {
                const normalized = this.normalizer.normalize(
                    event.stream,
                    event.payload,
                    event.timestamp
                );

                await this.kafka.publish(normalized);

                appLogger.info("Mock event published", {
                    stream: event.stream,
                });
            }
        });

        appLogger.info("Mock ingestion started");
    }

    async stop(): Promise<void> {
        await this.f1.stop();
        await this.kafka.disconnect();
    }
}
