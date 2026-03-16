export interface LapTimeState {
    value?: string | null; // "1:21.123"
    lap?: number | null;

    statusCode?: number | null;
    personalFastest?: boolean | null;
    overallFastest?: boolean | null;
}