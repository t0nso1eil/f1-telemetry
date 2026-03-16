import { AggregatorDelta } from "../domain/delta/agregatorDelta"
import { parseTimingData } from "./streams/parseTimingData"
import { parseWeather } from "./streams/parseWeather"
import { parseTrackStatus } from "./streams/parseTrackStatus"

export function parseFeed(messages: any[], timestamp: number): AggregatorDelta[] {

    const deltas: AggregatorDelta[] = []

    for (const msg of messages) {

        const payload = msg.A

        if (!payload) continue

        const stream = payload[0]
        const body = payload[1]

        switch (stream) {

            case "TimingData":
                deltas.push(...parseTimingData(body, timestamp))
                break

            case "WeatherData":
                deltas.push(...parseWeather(body, timestamp))
                break

            case "TrackStatus":
                deltas.push(...parseTrackStatus(body, timestamp))
                break

        }

    }

    return deltas
}