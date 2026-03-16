import { AggregatorDelta } from "../../domain/delta/agregatorDelta"
import {parserLogger} from "../../logger/logger";

export function parseDriverList(data: any, timestamp: number): AggregatorDelta[] {

    const deltas: AggregatorDelta[] = []

    if (!data) return deltas

    for (const driverId of Object.keys(data)) {

        parserLogger.debug({
            message: "DriverList received",
            drivers: Object.keys(data?.Lines || {}).length
        })

        const driver = data[driverId]

        deltas.push({
            type: "DRIVER_REGISTER",
            driverId,
            number: driver.RacingNumber,
            name: driver.FullName,
            team: driver.TeamName,
            messageId: timestamp,
            timestamp
        })

    }

    return deltas
}