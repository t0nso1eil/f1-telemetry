export interface ParsedEvent {
    stream: string;
    payload: unknown;
    timestamp?: string;
}

export class F1Parser {
    parse(raw: any): ParsedEvent[] {
        const events: ParsedEvent[] = [];

        if (!raw) {
            return events;
        }

        if (raw.R && typeof raw.R === "object") {
            for (const [stream, payload] of Object.entries(raw.R)) {
                if (stream === "_kf") continue;

                events.push({
                    stream,
                    payload,
                    timestamp: new Date().toISOString(),
                });
            }
        }

        if (raw.M && Array.isArray(raw.M)) {
            for (const msg of raw.M) {
                if (!msg?.A || !Array.isArray(msg.A)) continue;

                const [stream, payload, timestamp] = msg.A;

                if (!stream) continue;

                events.push({
                    stream,
                    payload,
                    timestamp,
                });
            }
        }

        return events;
    }
}
