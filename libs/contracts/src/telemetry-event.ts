export type TelemetryEventType = "SNAPSHOT" | "DELTA";

export interface TelemetryEvent<T = unknown> {
    type: TelemetryEventType;
    sessionId: string;
    timestamp: number;
    source: "F1_API";
    payload: T;
}