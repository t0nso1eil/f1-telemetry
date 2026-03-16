import { RaceState } from "./state/raceState"
import { AggregatorDelta } from "./delta/agregatorDelta"
import {stateLogger} from "../logger/logger";

export function applyDelta(
    state: RaceState,
    delta: AggregatorDelta
): RaceState {

    if (delta.messageId <= state.lastMessageId) {
        return state
    }

    const newState: RaceState = {
        ...state,
        drivers: new Map(state.drivers),
        lastMessageId: delta.messageId,
        lastUpdateTs: delta.timestamp
    }

    stateLogger.debug({
        message: "applying delta",
        delta
    })

    switch (delta.type) {

        case "DRIVER_POSITION": {

            const driver = newState.drivers.get(delta.driverId)
            if (!driver) return newState

            newState.drivers.set(delta.driverId, {
                ...driver,
                position: delta.position
            })

            return newState
        }

        case "LAP_COMPLETED": {

            const driver = newState.drivers.get(delta.driverId)
            if (!driver) return newState

            const bestLap =
                !driver.bestLapTime ||
                delta.lapTime < driver.bestLapTime
                    ? delta.lapTime
                    : driver.bestLapTime

            newState.drivers.set(delta.driverId, {
                ...driver,
                lapsCompleted: driver.lapsCompleted + 1,
                lastLapTime: delta.lapTime,
                bestLapTime: bestLap
            })

            return newState
        }

        case "TRACK_STATUS": {

            newState.track = {
                ...newState.track,
                status: delta.status
            }

            return newState
        }

        case "WEATHER_UPDATE": {

            newState.weather = {
                ...newState.weather,
                ...delta
            }

            return newState
        }

        case "FULL_SNAPSHOT": {

            return {
                ...state,
                ...delta.snapshot,
                lastMessageId: delta.messageId,
                lastUpdateTs: delta.timestamp
            }
        }

        case "DRIVER_PIT": {

            const driver = newState.drivers.get(delta.driverId)

            if (!driver) return newState

            newState.drivers.set(delta.driverId, {
                ...driver,
                inPit: delta.inPit
            })

            return newState
        }

        case "DRIVER_SPEED": {

                const driver = newState.drivers.get(delta.driverId)

                if (!driver) return newState

                newState.drivers.set(delta.driverId, {
                    ...driver,
                    speedTrap: delta.speedTrap
                })

                return newState
        }

        case "DRIVER_REGISTER": {

            if (state.drivers.has(delta.driverId))
                return state

            state.drivers.set(delta.driverId, {

                driverId: delta.driverId,
                number: delta.number,
                name: delta.name,
                team: delta.team,

                position: 0,
                lapsCompleted: 0,

                pitStops: 0,
                inPit: false,

                retired: false

            })

            return state
        }

        default:
            return newState
    }
}