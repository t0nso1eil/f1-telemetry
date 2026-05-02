import { AggregatorDelta } from "../../domain/delta/aggregatorDelta";
import { EventMeta } from "../eventMeta";

function mapTrackStatus(status?: string) {
    switch (String(status)) {
        case "1":
            return "all_clear" as const;
        case "2":
            return "yellow" as const;
        case "3":
            return "unknown" as const;
        case "4":
            return "safety_car" as const;
        case "5":
            return "red" as const;
        case "6":
            return "vsc" as const;
        case "7":
            return "vsc" as const;
        default:
            return "unknown" as const;
    }
}

export function parseTrackStatus(data: any, timestamp: number, meta: EventMeta): AggregatorDelta[] {
    return [
        {
            type: "TRACK_STATUS_UPDATE",
            trackStatus: mapTrackStatus(data?.Status),
            trackStatusMessage: data?.Message ?? null,
            messageId: timestamp * 1000,
            timestamp,

            eventId: meta.eventId,
            ingestionReceivedAt: meta.ingestionReceivedAt,
            aggregatorReceivedAt: meta.aggregatorReceivedAt,
        }
    ];
}
