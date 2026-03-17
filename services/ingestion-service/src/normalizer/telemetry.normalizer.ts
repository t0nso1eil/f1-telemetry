import { v4 as uuid } from "uuid";
import { NormalizedEvent } from "../types/normalized-event";

export class TelemetryNormalizer {
    normalize(stream: string, payload: unknown, ts?: string): NormalizedEvent {
        return {
            eventId: uuid(),
            timestamp: ts ? Date.parse(ts) : Date.now(),
            stream,
            source: "f1-live-timing",
            payload,
        };
    }
}