import { AggregatorDelta } from "../../domain/delta/agregatorDelta"
import {parserLogger} from "../../logger/logger";

export function parseTrackStatus(data: any, timestamp: number): AggregatorDelta[] {

    const statusMap: Record<string, any> = {
        "1": "GREEN",
        "2": "YELLOW",
        "4": "SC",
        "5": "RED"
    }

    parserLogger.debug({
        message: "TrackStatus received",
        trackStatus: Object.keys(data?.Lines || {}).length
    })

    return [
        {
            type: "TRACK_STATUS",
            status: statusMap[data.Status] ?? "GREEN",
            messageId: timestamp,
            timestamp
        }
    ]

}