import { SessionClockState } from "../session/sessionClockState";

export interface RaceStatusState {
    sessionStatus:
        | "pending"
        | "inactive"
        | "started"
        | "aborted"
        | "finished"
        | "finalised"
        | "ends"
        | "unknown";

    trackStatus:
        | "all_clear"
        | "yellow"
        | "double_yellow"
        | "red"
        | "vsc"
        | "safety_car"
        | "chequered"
        | "unknown";

    trackStatusMessage?: string | null;

    clock: SessionClockState;

    leaderRacingNumber?: string | null;
    totalCars: number;
    classifiedCars: number;
}