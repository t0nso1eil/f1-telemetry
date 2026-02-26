export type TimestampMs = number;

export type SessionType =
    | "PRACTICE"
    | "QUALIFYING"
    | "RACE";

export interface Identifiable {
    id: string;
}

export interface TimeRange {
    from: TimestampMs;
    to: TimestampMs;
}