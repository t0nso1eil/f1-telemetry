import { DomainDelta } from "../domainDelta";

export interface SessionStatusDelta extends DomainDelta {
    type: "SESSION_STATUS_UPDATE";

    sessionStatus?:
        | "pending"
        | "inactive"
        | "started"
        | "aborted"
        | "finished"
        | "finalised"
        | "ends"
        | "unknown";

    remainingMs?: number | null;
    extrapolating?: boolean | null;
}