import { DomainDelta } from "../domainDelta";

export interface RaceControlMessageDelta extends DomainDelta {
    type: "RACE_CONTROL_MESSAGE_ADD";

    message: {
        id: string;
        utc: number; // epoch millis UTC
        category: string;
        message: string;
        flag?: string | null;
        scope?: string | null;
        sector?: number | null;
        mode?: string | null;
    };
}