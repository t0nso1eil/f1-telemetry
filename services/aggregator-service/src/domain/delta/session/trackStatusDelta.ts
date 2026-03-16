import { DomainDelta } from "../domainDelta";

export interface TrackStatusDelta extends DomainDelta {
    type: "TRACK_STATUS_UPDATE";

    trackStatus?:
        | "all_clear"
        | "yellow"
        | "double_yellow"
        | "red"
        | "vsc"
        | "safety_car"
        | "chequered"
        | "unknown";

    trackStatusMessage?: string | null;
}