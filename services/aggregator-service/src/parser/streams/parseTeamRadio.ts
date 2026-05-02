import { AggregatorDelta } from "../../domain/delta/aggregatorDelta";
import { EventMeta } from "../eventMeta";

function toEpochMs(value?: string | null, fallback?: number): number {
    if (!value) return fallback ?? Date.now();

    const ms = Date.parse(value);
    return Number.isNaN(ms) ? (fallback ?? Date.now()) : ms;
}

function buildTeamRadioId(item: any, utc: number): string {
    return [utc, item?.RacingNumber ?? "", item?.Path ?? ""].join("|");
}

export function parseTeamRadio(data: any, timestamp: number, meta: EventMeta): AggregatorDelta[] {
    const deltas: AggregatorDelta[] = [];
    const captures = data?.Captures;

    if (!captures || typeof captures !== "object") {
        return deltas;
    }

    let seq = 0;

    for (const key of Object.keys(captures)) {
        const item = captures[key];
        if (!item) continue;

        const utc = toEpochMs(item.Utc, timestamp);
        const racingNumber = String(item.RacingNumber ?? "");

        deltas.push({
            type: "TEAM_RADIO_ADD",
            radio: {
                id: buildTeamRadioId(item, utc),
                utc,
                driverId: racingNumber,
                racingNumber,
                path: item.Path ?? ""
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
