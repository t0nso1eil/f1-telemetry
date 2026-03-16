import { v4 as uuid } from "uuid";

export interface NormalizedEvent {
    eventId: string;
    timestamp: number;
    stream: string;
    source: string;
    payload: any;
}

export class TelemetryNormalizer {

    normalize(stream: string, payload: any, ts?: string): NormalizedEvent {

        return {
            eventId: uuid(),
            timestamp: ts ? Date.parse(ts) : Date.now(),
            stream,
            source: "f1-live-timing",
            payload
        };
    }
}