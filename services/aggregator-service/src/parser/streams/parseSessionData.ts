import {AggregatorDelta} from "../../domain/delta/aggregatorDelta";
import { EventMeta } from "../eventMeta";

export function parseSessionData(data: any, timestamp: number, meta: EventMeta): AggregatorDelta[] {
    const deltas: AggregatorDelta[] = [];

    const qualifyingPart = extractLatestQualifyingPart(data?.Series);

    if (qualifyingPart !== undefined) {
        deltas.push({
            type: "SESSION_INFO_UPDATE",
            qualifyingPart,
            messageId: timestamp * 1000,
            timestamp,

            eventId: meta.eventId,
            ingestionReceivedAt: meta.ingestionReceivedAt,
            aggregatorReceivedAt: meta.aggregatorReceivedAt,
        });
    }

    return deltas;
}

function extractLatestQualifyingPart(series?: Record<string, any>): number | undefined {
    if (!series || typeof series !== "object") {
        return undefined;
    }

    const items = Object.values(series);

    const latest = items
        .filter(item => item?.QualifyingPart !== undefined)
        .sort((a, b) => Date.parse(b.Utc) - Date.parse(a.Utc))[0];

    return latest?.QualifyingPart;
}
