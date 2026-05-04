import { SessionState } from "./session/sessionState";
import { RaceStatusState } from "./race/raceStatusState";
import { WeatherState } from "./weather/weatherState";
import { DriverState } from "./driver/driverState";
import { RaceControlMessageState } from "./race/raceControlMessageState";
import { TeamRadioState } from "./race/teamRadioState";

export interface RaceState {
    sessionId: string;

    generatedAt?: number;      // когда агрегатор собрал текущее состояние/срез
    sourceTimestamp?: number;  // max timestamp входящих событий

    session: SessionState;
    raceStatus: RaceStatusState;
    weather?: WeatherState;

    drivers: Map<string, DriverState>;

    raceControlMessages: RaceControlMessageState[];
    teamRadio: TeamRadioState[];

    lastMessageId: number;
    lastUpdateTs: number;

    meta: {
        minIngestionReceivedAt: number | null;
        maxIngestionReceivedAt: number | null;

        minAggregatorReceivedAt: number | null;
        maxAggregatorReceivedAt: number | null;
    };
}
