import { LapTimeState } from "./lapTimeState";
import { SectorState } from "./sectorState";
import { SpeedTrapState } from "./speedTrapState";
import { BestSectorState } from "./bestSectorState";
import { BestSpeedsState } from "./bestSpeedsState";

export interface DriverTimingState {
    numberOfLaps?: number | null;

    gapToLeader?: string | null;
    intervalToAhead?: string | null;

    bestLap?: LapTimeState | null;
    lastLap?: LapTimeState | null;

    sectors: SectorState[];

    speeds: SpeedTrapState;
    bestSectors: BestSectorState[];
    bestSpeeds?: BestSpeedsState | null;
}