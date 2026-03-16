import {DriverPositionDelta} from "./driverPositionDelta"
import {LapCompletedDelta} from "./lapCompletedDelta"
import {TrackStatusDelta} from "./trackStatusDelta"
import {WeatherDelta} from "./weatherDelta"
import {FullSnapshotDelta} from "./fullSnapshotDelta"
import {DriverPitDelta} from "./driverPitDelta"
import {DriverSpeedDelta} from "./driverSpeedDelta";
import {DriverRegisterDelta} from "./driverRegisterDelta";
import {SessionDelta} from "./sessionDelta";

export type AggregatorDelta =
    | DriverPositionDelta
    | LapCompletedDelta
    | TrackStatusDelta
    | WeatherDelta
    | FullSnapshotDelta
    | DriverPitDelta
    | DriverSpeedDelta
    | DriverRegisterDelta
    | SessionDelta