import {DomainDelta} from "./domainDelta";

export interface LapCompletedDelta extends DomainDelta {
    type: "LAP_COMPLETED"
    driverId: string
    lapTime: number
}