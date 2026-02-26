import { TimestampMs } from "./common";
import { CarState } from "./car-state";
import { WeatherState } from "./weather";
import { RaceControlMessage } from "./race-control";

export interface RaceSnapshot {
    sessionId: string;
    sequence: number;        // монотонно растёт
    timestamp: TimestampMs;  // server time

    cars: Record<string, CarState>;

    weather?: WeatherState;
    raceControl?: RaceControlMessage[];
}