import {DomainDelta} from "./domainDelta";

export interface DriverPositionDelta extends DomainDelta {
    type: "DRIVER_POSITION"
    driverId: string
    position: number
}