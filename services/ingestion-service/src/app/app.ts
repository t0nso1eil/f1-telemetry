import { KafkaProducer } from "../kafka/producer";
import { F1SignalRClient } from "../f1/f1.client";
import { F1Parser } from "../parser/f1.parser";
import { TelemetryNormalizer } from "../normalizer/telemetry.normalizer";
import { appLogger, parserLogger } from "../logger";

export class IngestionApp {
    private kafka = new KafkaProducer();
    private f1 = new F1SignalRClient();
    private parser = new F1Parser();
    private normalizer = new TelemetryNormalizer();

    async start(): Promise<void> {
        await this.kafka.connect();

        await this.f1.start(async (rawMessage) => {
            const parsedEvents = this.parser.parse(rawMessage.data);

            parserLogger.info("Parsed raw message", {
                eventsCount: parsedEvents.length,
            });

            for (const event of parsedEvents) {
                const normalized = this.normalizer.normalize(
                    event.stream,
                    event.payload,
                    event.timestamp
                );

                await this.kafka.publish(normalized);

                appLogger.info("Normalized event published", {
                    stream: event.stream,
                    timestamp: normalized.timestamp,
                    eventId: normalized.eventId,
                });
            }
        });

        appLogger.info("Ingestion app started");
    }

    async stop(): Promise<void> {
        appLogger.info("Stopping ingestion app");

        await this.f1.stop();
        await this.kafka.disconnect();

        appLogger.info("Ingestion app stopped");
    }
}