import { parseFeed } from "./feedParser"
import { parseDeltaString } from "./deltaStringParser"
import { AggregatorDelta } from "../domain/delta/agregatorDelta"

export function parseEnvelope(raw: any): AggregatorDelta[] {

    const deltas: AggregatorDelta[] = []

    const timestamp = new Date(raw.timestamp).getTime()

    const data = raw.data

    if (!data) return deltas

    // delta string
    if (data.C) {
        deltas.push(...parseDeltaString(data.C, timestamp))
    }

    // streaming messages
    if (data.M) {
        deltas.push(...parseFeed(data.M, timestamp))
    }

    return deltas
}