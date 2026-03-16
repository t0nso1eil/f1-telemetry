import { DomainDelta } from "../domainDelta";

export interface TeamRadioDelta extends DomainDelta {
    type: "TEAM_RADIO_ADD";

    radio: {
        id: string;
        utc: number; // epoch millis UTC
        driverId: string;
        racingNumber: string;
        path: string;
    };
}