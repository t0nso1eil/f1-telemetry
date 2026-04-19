import { RaceState } from "./raceState";
import { DRIVER_FALLBACK } from "../meta/driverFallbackInfo";
import { mergeIdentity } from "./mergeIdentityState";
import {aggregatorLogger} from "../../logger";
import {fallbackAppliedTotal} from "../../metrics";

export function applyDriverFallback(state: RaceState): RaceState {
    const newDrivers = new Map(state.drivers);
    let applied = 0;

    for (const [driverId, driver] of newDrivers.entries()) {
        const fallback = DRIVER_FALLBACK[driver.racingNumber];

        if (!fallback) continue;

        // если уже есть норм имя -> пропускаем
        const isEmpty =
            !driver.identity.fullName &&
            !driver.identity.tla &&
            !driver.identity.teamName;

        if (!isEmpty) continue;
        applied++;

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

        if (applied > 0) {
            aggregatorLogger.debug("Driver fallback applied", {
                count: applied,
            });
        }
        fallbackAppliedTotal.inc(applied);

        newDrivers.set(driverId, updated);
    }

    return {
        ...state,
        drivers: newDrivers
    };
}
