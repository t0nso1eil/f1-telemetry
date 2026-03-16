import { DriverIdentityState } from "./driverIdentityState";
import { DriverTimingState } from "./driverTimingState";
import { DriverTyresState } from "./driverTyresState";
import { DriverTrackState } from "./driverTrackState";

export interface DriverState {
    driverId: string;
    racingNumber: string;

    line: number;
    position?: number | null;
    showPosition: boolean;

    identity: DriverIdentityState;
    timing: DriverTimingState;
    tyres: DriverTyresState;
    track: DriverTrackState;
}