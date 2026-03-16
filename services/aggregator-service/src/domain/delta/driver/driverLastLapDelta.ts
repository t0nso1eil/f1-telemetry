import { DomainDelta } from "../domainDelta";

export interface DriverLastLapDelta extends DomainDelta {
    type: "DRIVER_LAST_LAP_UPDATE";

    driverId: string;

    lastLap: {
        value?: string | null;
        lap?: number | null;
        statusCode?: number | null;
        personalFastest?: boolean | null;
        overallFastest?: boolean | null;
    } | null;
}