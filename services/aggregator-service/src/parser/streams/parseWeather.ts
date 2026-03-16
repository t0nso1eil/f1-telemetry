import { AggregatorDelta } from "../../domain/delta/agregatorDelta"
import {parserLogger} from "../../logger/logger";

export function parseWeather(data: any, timestamp: number): AggregatorDelta[] {

    parserLogger.debug({
        message: "Weather received",
        weather: Object.keys(data?.Lines || {}).length
    })

    return [
        {
            type: "WEATHER_UPDATE",
            airTemp: Number(data.AirTemp),
            trackTemp: Number(data.TrackTemp),
            messageId: timestamp,
            timestamp
        }
    ]

}