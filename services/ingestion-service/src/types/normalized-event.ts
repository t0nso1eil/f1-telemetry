export interface NormalizedEvent {
    eventId: string;
    timestamp: number;
    stream: string;
    source: string;
    payload: unknown;
    sourceReceivedAt: number;
}
