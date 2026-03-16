import {SessionMeta} from "./sessionMeta";
import {DriverState} from "./driverState";
import {TimingState} from "./timingState";
import {WeatherState} from "./weatherState";
import {SystemState} from "./systemState";
import {TrackState} from "./trackState";

export interface RaceState {
    sessionId: string

    meta: SessionMeta

    drivers: Map<string, DriverState>

    timing: TimingState

    track: TrackState

    weather: WeatherState

    system: SystemState

    lastMessageId: number
    lastUpdateTs: number
}