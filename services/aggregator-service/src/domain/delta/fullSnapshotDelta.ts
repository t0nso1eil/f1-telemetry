import {DomainDelta} from "./domainDelta";
import {RaceState} from "../state/raceState";

export interface FullSnapshotDelta extends DomainDelta {
    type: "FULL_SNAPSHOT"
    snapshot: Partial<RaceState>
}