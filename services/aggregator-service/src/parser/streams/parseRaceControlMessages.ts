import { AggregatorDelta } from "../../domain/delta/aggregatorDelta";
import { EventMeta } from "../eventMeta";

function toEpochMs(value?: string | null, fallback?: number): number {
    if (!value) return fallback ?? Date.now();

    const ms = Date.parse(value);
    return Number.isNaN(ms) ? (fallback ?? Date.now()) : ms;
}

function buildRaceControlId(message: any, utc: number): string {
    return [
        utc,
        message?.Category ?? "",
        message?.Message ?? "",
        message?.Flag ?? "",
        message?.Scope ?? "",
        message?.Sector ?? ""
    ].join("|");
}

export function parseRaceControlMessages(data: any, timestamp: number, meta: EventMeta): AggregatorDelta[] {
    const deltas: AggregatorDelta[] = [];
    const messages = data?.Messages;

    if (!messages || typeof messages !== "object") {
        return deltas;
    }

    let seq = 0;

    for (const key of Object.keys(messages)) {
        const item = messages[key];
        if (!item) continue;

        const utc = toEpochMs(item.Utc, timestamp);

        deltas.push({
            type: "RACE_CONTROL_MESSAGE_ADD",
            message: {
                id: buildRaceControlId(item, utc),
                utc,
                category: item.Category ?? "Other",
                message: item.Message ?? "",
                flag: item.Flag ?? null,
                scope: item.Scope ?? null,
                sector: item.Sector != null ? Number(item.Sector) : null,
                mode: item.Mode ?? null
            },
            messageId: timestamp * 1000 + seq++,
            timestamp,

            eventId: meta.eventId,
            ingestionReceivedAt: meta.ingestionReceivedAt,
            aggregatorReceivedAt: meta.aggregatorReceivedAt,
        });
    }

    return deltas;
}
