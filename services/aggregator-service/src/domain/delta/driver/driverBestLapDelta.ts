import { DomainDelta } from "../domainDelta";

export interface DriverBestLapDelta extends DomainDelta {
    type: "DRIVER_BEST_LAP_UPDATE";

    driverId: string;

    bestLap: {
        value?: string | null;       // "1:21.234"
        lap?: number | null;
        statusCode?: number | null;
        personalFastest?: boolean | null;
        overallFastest?: boolean | null;
    } | null;
}