import { AggregatorDelta } from "../../domain/delta/aggregatorDelta";

function toEpochMs(value?: string | null): number | null | undefined {
    if (value === undefined) return undefined;
    if (value === null || value === "") return null;

    const ms = Date.parse(value);
    return Number.isNaN(ms) ? undefined : ms;
}

function mapSessionType(value?: string) {
    const normalized = String(value ?? "").toLowerCase();

    if (normalized.includes("race")) return "race" as const;
    if (normalized.includes("qual")) return "qualifying" as const;
    if (normalized.includes("practice")) return "practice" as const;
    if (normalized.includes("sprint")) return "sprint" as const;

    return "unknown" as const;
}

export function parseSessionInfo(data: any, timestamp: number): AggregatorDelta[] {
    return [
        {
            type: "SESSION_INFO_UPDATE",
            sessionId: String(data?.SessionKey ?? data?.Key ?? ""),
            meetingKey: data?.Meeting?.Key ? Number(data.Meeting.Key) : undefined,
            sessionKey: data?.Key ? Number(data.Key) : undefined,
            grandPrixName: data?.Meeting?.Name ?? data?.Meeting?.OfficialName ?? "",
            officialName: data?.Meeting?.OfficialName ?? null,
            location: data?.Meeting?.Location ?? null,
            countryCode: data?.Meeting?.Country?.Code ?? null,
            countryName: data?.Meeting?.Country?.Name ?? null,
            circuitShortName: data?.Meeting?.Circuit?.ShortName ?? null,
            sessionType: mapSessionType(data?.Type),
            sessionName: data?.Name ?? "",
            sessionNumber: data?.Number != null ? Number(data.Number) : null,
            sessionPart: data?.SessionPart != null ? Number(data.SessionPart) : null,
            qualifyingPart: data?.QualifyingPart != null ? Number(data.QualifyingPart) : null,
            startTime: toEpochMs(data?.StartDate),
            endTime: toEpochMs(data?.EndDate),
            gmtOffset: data?.GmtOffset ?? null,
            messageId: timestamp * 1000,
            timestamp
        }
    ];
}