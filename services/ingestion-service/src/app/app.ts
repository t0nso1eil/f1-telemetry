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
            try {
                const parsedEvents = this.parser.parse(rawMessage.data);

                parserLogger.info("Parsed raw message", {
                    eventsCount: parsedEvents.length,
                });

                const batch = parsedEvents.map((event) =>
                    this.normalizer.normalize(
                        event.stream,
                        event.payload,
                        event.timestamp ??
                        new Date(rawMessage.timestamp).toISOString()
                    )
                );

                await this.kafka.publishBatch(batch);

                for (const normalized of batch) {
                    appLogger.info("Normalized event published", {
                        stream: normalized.stream,
                        timestamp: normalized.timestamp,
                        eventId: normalized.eventId,
                    });
                }
            } catch (error) {
                appLogger.error("Failed to process incoming message", { error });
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
