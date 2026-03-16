import {AggregatorDeltaType} from "./aggregatorDeltaType";

export interface DomainDelta {
    type: AggregatorDeltaType;
    messageId: number;
    timestamp: number; // UTC epoch millis
}