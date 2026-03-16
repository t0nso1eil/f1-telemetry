import { DomainDelta } from "../domainDelta";

export interface DriverTimingDelta extends DomainDelta {
    type: "DRIVER_TIMING_UPDATE";

    driverId: string;

    numberOfLaps?: number | null;

    gapToLeader?: string | null;
    intervalToAhead?: string | null;
}