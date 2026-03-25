import { RaceState } from "../state/raceState";
import { DriverState } from "../state/driver/driverState";
import { RaceSnapshot } from "./raceSnapshot";
import { snapshotLogger } from "../../logger";
import { config } from "../../config/config"

function toIso(value?: number): string | null {
    if (!value) return null;
    return new Date(value).toISOString();
}

function sortDrivers(drivers: DriverState[]): DriverState[] {
    return [...drivers].sort((a, b) => {
        const posA = a.position ?? Number.MAX_SAFE_INTEGER;
        const posB = b.position ?? Number.MAX_SAFE_INTEGER;

        if (posA !== posB) return posA - posB;
        return a.line - b.line;
    });
}

export function buildRaceSnapshot(state: RaceState): RaceSnapshot {
    const drivers = sortDrivers([...state.drivers.values()]);

    const snapshot: RaceSnapshot = {
        schema_version: state.schemaVersion,
        session_key: state.sessionId,
        sequence: state.sequence,
        generated_at: new Date().toISOString(),
        source_timestamp: toIso(state.sourceTimestamp),
        interval_ms: 2000,

        session: {
            ...state.session,
            startTime: toIso(state.session.startTime ?? undefined),
            endTime: toIso(state.session.endTime ?? undefined)
        },

        race_state: {
            sessionStatus: state.raceStatus.sessionStatus,
            trackStatus: state.raceStatus.trackStatus,
            trackStatusMessage: state.raceStatus.trackStatusMessage ?? null,
            clock: {
                utc: new Date().toISOString(),
                remainingMs: state.raceStatus.clock.remainingMs ?? null,
                extrapolating: state.raceStatus.clock.extrapolating
            },
            leaderRacingNumber: state.raceStatus.leaderRacingNumber ?? null,
            totalCars: state.raceStatus.totalCars,
            classifiedCars: state.raceStatus.classifiedCars
        },

        weather: state.weather ?? null,

        drivers: drivers.map((driver) => ({
            racingNumber: driver.racingNumber,
            line: driver.line,
            position: driver.position ?? null,
            showPosition: driver.showPosition,
            identity: driver.identity,
            timing: driver.timing,
            tyres: driver.tyres,
            track: driver.track
        })),

        race_control_messages: state.raceControlMessages.map((item) => ({
            ...item,
            utc: toIso(item.utc)
        })),

        team_radio: state.teamRadio.map((item) => ({
            ...item,
            utc: toIso(item.utc)
        }))
    };

    snapshotLogger.debug("Snapshot built", {
        drivers: snapshot.drivers.length,
        sequence: snapshot.sequence,
    });

    return snapshot;
}