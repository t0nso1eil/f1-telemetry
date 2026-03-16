import { AggregatorDelta } from "../../domain/delta/agregatorDelta"
import {parserLogger} from "../../logger/logger";

export function parseSession(
    data: any,
    timestamp: number
): AggregatorDelta[] {

    parserLogger.debug({
        message: "SessionData received",
        data
    })

    return [
        {
            type: "SESSION_UPDATE",
            name: data?.Name,
            status: data?.Status,
            sessionType: data?.Type,
            trackName: data?.TrackName,
            timestamp,
            messageId: timestamp
        }
    ]
}