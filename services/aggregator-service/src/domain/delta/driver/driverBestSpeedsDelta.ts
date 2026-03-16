import { DomainDelta } from "../domainDelta";

export interface DriverBestSpeedsDelta extends DomainDelta {
    type: "DRIVER_BEST_SPEEDS_UPDATE";

    driverId: string;

    bestSpeeds: {
        i1?: {
            value?: number | null;
            position?: number | null;
        } | null;
        i2?: {
            value?: number | null;
            position?: number | null;
        } | null;
        fl?: {
            value?: number | null;
            position?: number | null;
        } | null;
        st?: {
            value?: number | null;
            position?: number | null;
        } | null;
    } | null;
}