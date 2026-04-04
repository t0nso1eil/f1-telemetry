import { RaceState } from "./raceState";
import {DRIVER_FALLBACK} from "../meta/driverFallbackInfo";
import {mergeIdentity} from "./mergeIdentityState";

export function applyDriverFallback(state: RaceState): RaceState {
    const newDrivers = new Map(state.drivers);

    for (const [driverId, driver] of newDrivers.entries()) {
        const fallback = DRIVER_FALLBACK[driver.racingNumber];

        if (!fallback) continue;

        // если уже есть норм имя -> пропускаем
        const isEmpty =
            !driver.identity.fullName &&
            !driver.identity.tla &&
            !driver.identity.teamName;

        if (!isEmpty) continue;

        const updated = {
            ...driver,
            identity: mergeIdentity(
                driver.identity,
                {
                    tla: fallback.tla,
                    broadcastName: fallback.broadcastName,
                    fullName: fallback.fullName,
                    firstName: fallback.firstName,
                    lastName: fallback.lastName,
                    teamName: fallback.teamName,
                    teamColor: fallback.teamColor
                },
                "FALLBACK",
                Date.now()
            ),
            line: driver.line
        };

        newDrivers.set(driverId, updated);
    }

    return {
        ...state,
        drivers: newDrivers
    };
}