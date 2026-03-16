import { DomainDelta } from "../domainDelta";

export interface SessionInfoDelta extends DomainDelta {
    type: "SESSION_INFO_UPDATE";

    sessionId?: string;

    meetingKey?: number;
    sessionKey?: number;

    grandPrixName?: string;
    officialName?: string;

    location?: string;
    countryCode?: string;
    countryName?: string;
    circuitShortName?: string;

    sessionType?: "race" | "qualifying" | "practice" | "sprint" | "unknown";
    sessionName?: string;
    sessionNumber?: number | null;
    sessionPart?: number | null;
    qualifyingPart?: number | null;

    startTime?: number | null; // UTC epoch millis
    endTime?: number | null;   // UTC epoch millis
    gmtOffset?: string | null;
}