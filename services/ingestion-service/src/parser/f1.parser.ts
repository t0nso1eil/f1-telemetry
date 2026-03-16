export interface ParsedEvent {
    stream: string;
    payload: any;
    timestamp: Date;
}

export class F1Parser {

    parse(raw: any): ParsedEvent[] {

        if (!raw.M || !Array.isArray(raw.M))
            return [];

        const events: ParsedEvent[] = [];

        for (const msg of raw.M) {

            if (!msg.A || !Array.isArray(msg.A))
                continue;

            const [stream, payload, timestamp] = msg.A;

            events.push({
                stream,
                payload,
                timestamp
            });
        }

        return events;
    }
}