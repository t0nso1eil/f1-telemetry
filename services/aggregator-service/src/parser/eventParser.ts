import { AggregatorDelta } from "../domain/delta/agregatorDelta"

import { parseDriverList } from "./streams/parseDriverList"
import { parseTimingData } from "./streams/parseTimingData"
import { parseWeather } from "./streams/parseWeather"
import { parseTrackStatus } from "./streams/parseTrackStatus"
import { parseSession } from "./streams/parseSession"

import { parserLogger, errorLogger } from "../logger/logger"


export function parseNormalizedEvent(event: any): AggregatorDelta[] {

    const deltas: AggregatorDelta[] = []

    if (!event) {
        parserLogger.warn("parseNormalizedEvent: empty event")
        return deltas
    }

    const stream = event.stream
    const payload = event.payload
    const timestamp = event.timestamp ?? Date.now()

    // 🔎 Лог входящего события
    parserLogger.debug({
        message: "event received",
        stream,
        timestamp
    })

    if (!payload) {

        parserLogger.warn({
            message: "event without payload",
            stream
        })

        return deltas
    }

    try {

        let parsed: AggregatorDelta[] = []

        switch (stream) {

            case "DriverList":

                parserLogger.debug({
                    message: "parsing DriverList"
                })

                parsed = parseDriverList(payload, timestamp)
                break


            case "TimingData":

                parserLogger.debug({
                    message: "parsing TimingData"
                })

                parsed = parseTimingData(payload, timestamp)
                break


            case "WeatherData":

                parserLogger.debug({
                    message: "parsing WeatherData"
                })

                parsed = parseWeather(payload, timestamp)
                break


            case "TrackStatus":

                parserLogger.debug({
                    message: "parsing TrackStatus"
                })

                parsed = parseTrackStatus(payload, timestamp)
                break


            case "SessionData":

                parserLogger.debug({
                    message: "parsing SessionData"
                })

                parsed = parseSession(payload, timestamp)
                break


            default:

                parserLogger.debug({
                    message: "unknown stream skipped",
                    stream
                })

                return deltas
        }

        // 🔎 Лог результатов парсинга
        parserLogger.debug({
            message: "deltas produced",
            stream,
            count: parsed.length
        })

        if (parsed.length > 0) {

            parserLogger.debug({
                message: "delta preview",
                delta: parsed[0]
            })

        }

        return parsed

    } catch (err) {

        errorLogger.error({
            message: "parser error",
            stream,
            error: err
        })

        return deltas
    }
}