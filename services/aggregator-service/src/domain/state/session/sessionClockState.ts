export interface SessionClockState {
    utc: number;
    remainingMs?: number | null;
    extrapolating: boolean;
}