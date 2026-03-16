import { AggregatorDelta } from "../../domain/delta/agregatorDelta"
import {parserLogger} from "../../logger/logger";

export function parseTimingData(data: any, timestamp: number): AggregatorDelta[] {

    const deltas: AggregatorDelta[] = []

    if (!data?.Lines) return deltas

    for (const driverId of Object.keys(data.Lines)) {

        parserLogger.debug({
            message: "TimingData received",
            timingData: Object.keys(data?.Lines || {}).length
        })

        const line = data.Lines[driverId]

        if (line.Position) {

            parserLogger.debug({
                driverId,
                line
            })

            deltas.push({
                type: "DRIVER_POSITION",
                driverId,
                position: Number(line.Position),
                messageId: timestamp,
                timestamp
            })

        }

        if (line.InPit !== undefined) {

            parserLogger.debug({
                driverId,
                line
            })

            deltas.push({
                type: "DRIVER_PIT",
                driverId,
                inPit: line.InPit,
                messageId: timestamp + 1,
                timestamp
            })

        }

        if (line.Speeds?.ST?.Value) {

            parserLogger.debug({
                driverId,
                line
            })

            deltas.push({
                type: "DRIVER_SPEED",
                driverId,
                speedTrap: Number(line.Speeds.ST.Value),
                messageId: timestamp + 2,
                timestamp
            })

        }


        // LAST LAP
        if (line.LastLapTime?.Value) {

            deltas.push({
                type: "LAP_COMPLETED",
                driverId,
                lapTime: parseLap(line.LastLapTime.Value),
                timestamp,
                messageId: timestamp
            })
        }

        // LAP COUNT
        if (line.NumberOfLaps) {

            deltas.push({
                type: "LAP_COMPLETED",
                driverId,
                lapTime: 0,
                timestamp,
                messageId: timestamp
            })
        }

    }

    return deltas
}

function parseLap(value: string): number {

    const parts = value.split(":")
    if (parts.length !== 2) return Number(value)

    const minutes = Number(parts[0])
    const seconds = Number(parts[1])

    return minutes * 60 + seconds
}