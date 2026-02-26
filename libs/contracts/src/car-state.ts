export interface CarState {
    driverId: string;
    team?: string;

    position?: number;
    lap?: number;

    lastLapTimeMs?: number;
    bestLapTimeMs?: number;

    sectorTimesMs?: number[];

    speedKmh?: number;
    gear?: number;
    rpm?: number;
    drs?: boolean;

    tyre?: TyreState;
}

export interface TyreState {
    compound: "SOFT" | "MEDIUM" | "HARD" | "INTER" | "WET";
    laps: number;
    wearPercent?: number;
}