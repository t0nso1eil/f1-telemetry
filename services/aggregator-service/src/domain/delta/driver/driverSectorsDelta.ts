import { DomainDelta } from "../domainDelta";

export interface DriverSectorsDelta extends DomainDelta {
    type: "DRIVER_SECTORS_UPDATE";

    driverId: string;

    sectors: Array<{
        sector: 1 | 2 | 3;
        value?: string | null;
        previousValue?: string | null;
        stopped?: boolean;
        statusCode?: number | null;
        personalFastest?: boolean | null;
        overallFastest?: boolean | null;
        segments?: Array<{
            segment: number;
            statusCode: number;
        }>;
    }>;
}