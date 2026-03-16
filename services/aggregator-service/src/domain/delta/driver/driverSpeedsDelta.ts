import { DomainDelta } from "../domainDelta";

export interface DriverSpeedsDelta extends DomainDelta {
    type: "DRIVER_SPEEDS_UPDATE";

    driverId: string;

    speeds: {
        i1?: {
            value?: number | null;
            statusCode?: number | null;
            personalFastest?: boolean | null;
            overallFastest?: boolean | null;
        } | null;
        i2?: {
            value?: number | null;
            statusCode?: number | null;
            personalFastest?: boolean | null;
            overallFastest?: boolean | null;
        } | null;
        fl?: {
            value?: number | null;
            statusCode?: number | null;
            personalFastest?: boolean | null;
            overallFastest?: boolean | null;
        } | null;
        st?: {
            value?: number | null;
            statusCode?: number | null;
            personalFastest?: boolean | null;
            overallFastest?: boolean | null;
        } | null;
    };
}