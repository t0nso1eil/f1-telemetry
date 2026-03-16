export interface DriverTrackState {
    inPit: boolean;
    pitOut: boolean;
    stopped: boolean;
    retired: boolean;

    knockedOut?: boolean | null;
    cutoff?: boolean | null;

    statusCode?: number | null;
}