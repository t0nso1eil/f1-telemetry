import { DomainDelta } from "../domainDelta";

export interface DriverRemoveDelta extends DomainDelta {
    type: "DRIVER_REMOVE";
    driverId: string;
}