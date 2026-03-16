import {DomainDelta} from "./domainDelta";
import {TrackState} from "../state/trackState";

export interface TrackStatusDelta extends DomainDelta {
    type: "TRACK_STATUS"
    status: TrackState["status"]
}