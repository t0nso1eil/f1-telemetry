import { KafkaProducer } from "./kafka/producer";
import { F1SignalRClient } from "./f1/f1.client";
import { F1Parser } from "./parser/f1.parser";
import { TelemetryNormalizer } from "./normalizer/telemetry.normalizer";

async function main() {

    const kafka = new KafkaProducer();
    const f1 = new F1SignalRClient();
    const parser = new F1Parser();
    const normalizer = new TelemetryNormalizer();

    await kafka.connect();

    await f1.start(async (rawMessage) => {

        const parsedEvents = parser.parse(rawMessage.data);

        for (const event of parsedEvents) {

            const normalized =
                normalizer.normalize(event.stream, event.payload);

            await kafka.publish(normalized);

            console.log(
                `📤 ${event.stream} published`
            );
        }

    });

}

main();