export interface ParsedEvent {
    stream: string;
    payload: unknown;
    timestamp?: string;
}

export class F1Parser {
    parse(raw: any): ParsedEvent[] {
        if (!raw?.M || !Array.isArray(raw.M)) {
            return [];
        }

        const events: ParsedEvent[] = [];

        for (const msg of raw.M) {
            if (!msg?.A || !Array.isArray(msg.A)) {
                continue;
            }

            const [stream, payload, timestamp] = msg.A;

            if (!stream) {
                continue;
            }

            events.push({
                stream,
                payload,
                timestamp,
            });
        }

        return events;
    }
}