export interface ParsedEvent {
    stream: string;
    payload: any;
}

export class F1Parser {

    parse(raw: any): ParsedEvent[] {

        if (!raw.M || !Array.isArray(raw.M))
            return [];

        const events: ParsedEvent[] = [];

        for (const msg of raw.M) {

            if (!msg.M || !msg.A)
                continue;

            events.push({
                stream: msg.M,
                payload: msg.A
            });
        }

        return events;
    }
}