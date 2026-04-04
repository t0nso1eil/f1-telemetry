import {DriverIdentityState} from "./driver/driverIdentityState";
import {IdentitySource} from "../meta/identitySource";

const SOURCE_PRIORITY: Record<IdentitySource, number> = {
    FALLBACK: 0,
    TIMING: 1,
    DRIVER_LIST: 2
};

export function mergeIdentity(
    current: DriverIdentityState,
    patch: Partial<DriverIdentityState>,
    source: IdentitySource,
    timestamp: number
): DriverIdentityState {
    const currentPriority = SOURCE_PRIORITY[current.meta.source];
    const incomingPriority = SOURCE_PRIORITY[source];

    if (incomingPriority < currentPriority) {
        return current;
    }

    const result: DriverIdentityState = {
        ...current,
        meta: {
            source,
            updatedAt: timestamp
        }
    };

    for (const key of Object.keys(patch) as (keyof DriverIdentityState)[]) {
        if (key === "meta") continue;

        const value = patch[key];

        if (value !== undefined && value !== null) {
            result[key] = value;
        }
    }

    return result;
}