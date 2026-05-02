import { AggregatorDeltaType } from "./aggregatorDeltaType";

export interface DomainDelta {
    type: AggregatorDeltaType;
    messageId: number;
    timestamp: number;

    eventId: string;
    ingestionReceivedAt: number;
    aggregatorReceivedAt: number;
}
