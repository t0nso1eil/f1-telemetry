import { v4 as uuid } from "uuid";

export interface NormalizedEvent {
    eventId: string;
    timestamp: number;
    stream: string;
    source: string;
    payload: any;
}

export class TelemetryNormalizer {

    normalize(stream: string, payload: any): NormalizedEvent {

        return {
            eventId: uuid(),
            timestamp: Date.now(),
            stream,
            source: "f1-live-timing",
            payload
        };
    }
}