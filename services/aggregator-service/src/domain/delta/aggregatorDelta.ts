import { FullSnapshotDelta } from "./fullSnapshotDelta";

import { SessionInfoDelta } from "./session/sessionInfoDelta";
import { SessionStatusDelta } from "./session/sessionStatusDelta";
import { TrackStatusDelta } from "./session/trackStatusDelta";

import { WeatherDelta } from "./weather/weatherDelta";

import { DriverUpsertDelta } from "./driver/driverUpsertDelta";
import { DriverRemoveDelta } from "./driver/driverRemoveDelta";
import { DriverPositionDelta } from "./driver/driverPositionDelta";
import { DriverTimingDelta } from "./driver/driverTimingDelta";
import { DriverBestLapDelta } from "./driver/driverBestLapDelta";
import { DriverLastLapDelta } from "./driver/driverLastLapDelta";
import { DriverSectorsDelta } from "./driver/driverSectorsDelta";
import { DriverSpeedsDelta } from "./driver/driverSpeedsDelta";
import { DriverBestSpeedsDelta } from "./driver/driverBestSpeedsDelta";
import { DriverTyreDelta } from "./driver/driverTyreDelta";
import { DriverStintsDelta } from "./driver/driverStintsDelta";
import { DriverTrackStateDelta } from "./driver/driverTrackStateDelta";

import { RaceControlMessageDelta } from "./events/raceControlMessageDelta";
import { TeamRadioDelta } from "./events/teamRadioDelta";

export type AggregatorDelta =
    | FullSnapshotDelta

    | SessionInfoDelta
    | SessionStatusDelta
    | TrackStatusDelta

    | WeatherDelta

    | DriverUpsertDelta
    | DriverRemoveDelta
    | DriverPositionDelta
    | DriverTimingDelta
    | DriverBestLapDelta
    | DriverLastLapDelta
    | DriverSectorsDelta
    | DriverSpeedsDelta
    | DriverBestSpeedsDelta
    | DriverTyreDelta
    | DriverStintsDelta
    | DriverTrackStateDelta

    | RaceControlMessageDelta
    | TeamRadioDelta;