import { DomainDelta } from "../domainDelta";

export interface DriverPositionDelta extends DomainDelta {
    type: "DRIVER_POSITION_UPDATE";

    driverId: string;

    position?: number | null;
    line?: number | null;
    showPosition?: boolean | null;

    gapToLeader?: string | null;
    intervalToAhead?: string | null;
}