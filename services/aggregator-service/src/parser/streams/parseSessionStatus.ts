import { AggregatorDelta } from "../../domain/delta/aggregatorDelta";

function mapSessionStatus(status?: string) {
    switch (String(status ?? "").toLowerCase()) {
        case "inactive":
            return "inactive" as const;
        case "started":
            return "started" as const;
        case "aborted":
            return "aborted" as const;
        case "finished":
            return "finished" as const;
        case "finalised":
            return "finalised" as const;
        case "ends":
            return "ends" as const;
        default:
            return "unknown" as const;
    }
}

export function parseSessionStatus(data: any, timestamp: number): AggregatorDelta[] {
    return [
        {
            type: "SESSION_STATUS_UPDATE",
            sessionStatus: mapSessionStatus(data?.Status),
            remainingMs:
                data?.Remaining != null
                    ? Number(data.Remaining)
                    : null,
            extrapolating:
                typeof data?.Extrapolating === "boolean"
                    ? data.Extrapolating
                    : undefined,
            messageId: timestamp * 1000,
            timestamp
        }
    ];
}