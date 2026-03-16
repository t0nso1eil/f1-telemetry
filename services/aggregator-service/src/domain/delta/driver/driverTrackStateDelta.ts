import { DomainDelta } from "../domainDelta";

export interface DriverTrackStateDelta extends DomainDelta {
    type: "DRIVER_TRACK_STATE_UPDATE";

    driverId: string;

    inPit?: boolean;
    pitOut?: boolean;
    stopped?: boolean;
    retired?: boolean;
    knockedOut?: boolean | null;
    cutoff?: boolean | null;
    statusCode?: number | null;
}