import { AggregatorDelta } from "./delta/aggregatorDelta";
import { RaceState } from "./state/raceState";
import { DriverState } from "./state/driver/driverState";
import { RaceControlMessageState } from "./state/race/raceControlMessageState";
import { TeamRadioState } from "./state/race/teamRadioState";
import { aggregatorLogger } from "../logger";
import { mergeIdentity } from "./state/mergeIdentityState";
import {deltaByType} from "../metrics";


function cloneDriver(driver: DriverState): DriverState {
    return {
        ...driver,
        identity: { ...driver.identity },
        timing: {
            ...driver.timing,
            bestLap: driver.timing.bestLap ? { ...driver.timing.bestLap } : driver.timing.bestLap,
            lastLap: driver.timing.lastLap ? { ...driver.timing.lastLap } : driver.timing.lastLap,
            sectors: driver.timing.sectors.map((sector) => ({
                ...sector,
                segments: sector.segments.map((segment) => ({ ...segment }))
            })),
            speeds: {
                ...driver.timing.speeds,
                i1: driver.timing.speeds.i1 ? { ...driver.timing.speeds.i1 } : driver.timing.speeds.i1,
                i2: driver.timing.speeds.i2 ? { ...driver.timing.speeds.i2 } : driver.timing.speeds.i2,
                fl: driver.timing.speeds.fl ? { ...driver.timing.speeds.fl } : driver.timing.speeds.fl,
                st: driver.timing.speeds.st ? { ...driver.timing.speeds.st } : driver.timing.speeds.st
            },
            bestSectors: driver.timing.bestSectors.map((sector) => ({ ...sector })),
            bestSpeeds: driver.timing.bestSpeeds
                ? {
                    ...driver.timing.bestSpeeds,
                    i1: driver.timing.bestSpeeds.i1 ? { ...driver.timing.bestSpeeds.i1 } : driver.timing.bestSpeeds.i1,
                    i2: driver.timing.bestSpeeds.i2 ? { ...driver.timing.bestSpeeds.i2 } : driver.timing.bestSpeeds.i2,
                    fl: driver.timing.bestSpeeds.fl ? { ...driver.timing.bestSpeeds.fl } : driver.timing.bestSpeeds.fl,
                    st: driver.timing.bestSpeeds.st ? { ...driver.timing.bestSpeeds.st } : driver.timing.bestSpeeds.st
                }
                : driver.timing.bestSpeeds
        },
        tyres: {
            ...driver.tyres,
            stints: driver.tyres.stints.map((stint) => ({ ...stint }))
        },
        track: { ...driver.track }
    };
}

function createInitialDriverState(params: {
    driverId: string;
    racingNumber: string;
    tla?: string;
    broadcastName?: string | null;
    fullName?: string;
    firstName?: string | null;
    lastName?: string | null;
    teamName?: string;
    teamColor?: string | null;
    line?: number | null;
}): DriverState {
    return {
        driverId: params.driverId,
        racingNumber: params.racingNumber,
        line: params.line ?? 0,
        position: null,
        showPosition: true,
        identity: {
            tla: params.tla ?? null,
            broadcastName: params.broadcastName ?? null,
            fullName: params.fullName ?? null,
            firstName: params.firstName ?? null,
            lastName: params.lastName ?? null,
            teamName: params.teamName ?? null,
            teamColor: params.teamColor ?? null,
            meta: {
                source: "FALLBACK",
                updatedAt: Date.now()
            }
        },
        timing: {
            numberOfLaps: null,
            gapToLeader: null,
            intervalToAhead: null,
            bestLap: null,
            lastLap: null,
            sectors: [],
            speeds: {},
            bestSectors: [],
            bestSpeeds: null
        },
        tyres: {
            currentCompound: "unknown",
            isNew: null,
            tyreAgeLaps: null,
            tyresNotChanged: null,
            stints: []
        },
        track: {
            inPit: false,
            pitOut: false,
            stopped: false,
            retired: false,
            knockedOut: null,
            cutoff: null,
            statusCode: null
        }
    };
}

function getOrCreateDriver(
    state: RaceState,
    driverId: string,
    fallback?: Partial<Pick<DriverState, "driverId" | "racingNumber" | "line">>
): DriverState {
    const existing = state.drivers.get(driverId);
    if (existing) {
        return cloneDriver(existing);
    }

    return createInitialDriverState({
        driverId,
        racingNumber: fallback?.racingNumber ?? driverId,
        line: fallback?.line ?? 0
    });
}

function mergeDefined<T extends object>(target: T, patch: Partial<T>): T {
    const result = { ...target };

    for (const [key, value] of Object.entries(patch)) {
        if (value !== undefined) {
            (result as Record<string, unknown>)[key] = value;
        }
    }

    return result;
}

function sortNewestFirstByUtc<T extends { utc: number }>(items: T[]): T[] {
    return [...items].sort((a, b) => b.utc - a.utc);
}

function upsertRaceControlMessage(
    items: RaceControlMessageState[],
    incoming: RaceControlMessageState
): RaceControlMessageState[] {
    const existingIndex = items.findIndex((item) => item.id === incoming.id);

    if (existingIndex === -1) {
        return sortNewestFirstByUtc([incoming, ...items]);
    }

    const next = [...items];
    next[existingIndex] = {
        ...next[existingIndex],
        ...incoming
    };

    return sortNewestFirstByUtc(next);
}

function upsertTeamRadio(
    items: TeamRadioState[],
    incoming: TeamRadioState
): TeamRadioState[] {
    const existingIndex = items.findIndex((item) => item.id === incoming.id);

    if (existingIndex === -1) {
        return sortNewestFirstByUtc([incoming, ...items]);
    }

    const next = [...items];
    next[existingIndex] = {
        ...next[existingIndex],
        ...incoming
    };

    return sortNewestFirstByUtc(next);
}

function recalculateRaceStatusCounters(state: RaceState): RaceState {
    const drivers = [...state.drivers.values()];

    const totalCars = drivers.length;
    const classifiedCars = drivers.filter((driver) => driver.position != null).length;

    let leaderRacingNumber: string | null = null;

    const leader = drivers
        .filter((driver) => driver.position != null)
        .sort((a, b) => {
            const posA = a.position ?? Number.MAX_SAFE_INTEGER;
            const posB = b.position ?? Number.MAX_SAFE_INTEGER;
            if (posA !== posB) return posA - posB;
            return a.line - b.line;
        })[0];

    if (leader) {
        leaderRacingNumber = leader.racingNumber;
    }

    return {
        ...state,
        raceStatus: {
            ...state.raceStatus,
            totalCars,
            classifiedCars,
            leaderRacingNumber
        }
    };
}

export function applyDelta(state: RaceState, delta: AggregatorDelta): RaceState {
    deltaByType.inc({ type: delta.type });
    if (delta.messageId <= state.lastMessageId) {
        return state;
    }

    aggregatorLogger.debug("Delta received", {
        type: delta.type,
        messageId: delta.messageId,
    });

    let newState: RaceState = {
        ...state,
        session: { ...state.session },
        raceStatus: {
            ...state.raceStatus,
            clock: { ...state.raceStatus.clock }
        },
        weather: state.weather ? { ...state.weather } : state.weather,
        drivers: new Map(state.drivers),
        raceControlMessages: [...state.raceControlMessages],
        teamRadio: [...state.teamRadio],
        lastMessageId: delta.messageId,
        lastUpdateTs: delta.timestamp,
        sourceTimestamp: Math.max(state.sourceTimestamp ?? 0, delta.timestamp)
    };

    switch (delta.type) {
        case "FULL_SNAPSHOT": {
            return recalculateRaceStatusCounters({
                ...state,
                ...delta.snapshot,
                session: delta.snapshot.session
                    ? { ...delta.snapshot.session }
                    : state.session,
                raceStatus: delta.snapshot.raceStatus
                    ? {
                        ...delta.snapshot.raceStatus,
                        clock: delta.snapshot.raceStatus.clock
                            ? { ...delta.snapshot.raceStatus.clock }
                            : { ...state.raceStatus.clock }
                    }
                    : state.raceStatus,
                weather:
                    delta.snapshot.weather !== undefined
                        ? delta.snapshot.weather
                            ? { ...delta.snapshot.weather }
                            : delta.snapshot.weather
                        : state.weather,
                drivers:
                    delta.snapshot.drivers !== undefined
                        ? new Map(delta.snapshot.drivers)
                        : new Map(state.drivers),
                raceControlMessages:
                    delta.snapshot.raceControlMessages !== undefined
                        ? [...delta.snapshot.raceControlMessages]
                        : [...state.raceControlMessages],
                teamRadio:
                    delta.snapshot.teamRadio !== undefined
                        ? [...delta.snapshot.teamRadio]
                        : [...state.teamRadio],
                lastMessageId: delta.messageId,
                lastUpdateTs: delta.timestamp,
                sourceTimestamp: Math.max(state.sourceTimestamp ?? 0, delta.timestamp)
            });
        }

        case "SESSION_INFO_UPDATE": {
            newState.session = mergeDefined(newState.session, {
                meetingKey: delta.meetingKey,
                sessionKey: delta.sessionKey,
                grandPrixName: delta.grandPrixName,
                officialName: delta.officialName,
                location: delta.location,
                countryCode: delta.countryCode,
                countryName: delta.countryName,
                circuitShortName: delta.circuitShortName,
                sessionType: delta.sessionType,
                sessionName: delta.sessionName,
                sessionNumber: delta.sessionNumber,
                sessionPart: delta.sessionPart,
                qualifyingPart: delta.qualifyingPart,
                startTime: delta.startTime,
                endTime: delta.endTime,
                gmtOffset: delta.gmtOffset
            });

            if (delta.sessionId !== undefined) {
                newState.sessionId = delta.sessionId;
            }
            aggregatorLogger.debug("Session info updated", {
                sessionId: newState.sessionId,
                sessionName: newState.session.sessionName
            });

            return recalculateRaceStatusCounters(newState);
        }

        case "SESSION_STATUS_UPDATE": {
            newState.raceStatus = {
                ...newState.raceStatus,
                sessionStatus: delta.sessionStatus ?? newState.raceStatus.sessionStatus,
                clock: mergeDefined(newState.raceStatus.clock, {
                    remainingMs: delta.remainingMs,
                    extrapolating:
                        delta.extrapolating === null
                            ? undefined
                            : delta.extrapolating
                })
            };
            aggregatorLogger.debug("Race status updated", {
                status: newState.raceStatus
            });

            return recalculateRaceStatusCounters(newState);
        }

        case "TRACK_STATUS_UPDATE": {
            newState.raceStatus = {
                ...newState.raceStatus,
                trackStatus: delta.trackStatus ?? newState.raceStatus.trackStatus,
                trackStatusMessage:
                    delta.trackStatusMessage !== undefined
                        ? delta.trackStatusMessage
                        : newState.raceStatus.trackStatusMessage
            };

            aggregatorLogger.debug("Track status updated", {
                trackStatus: newState.raceStatus.trackStatus
            });

            return recalculateRaceStatusCounters(newState);
        }

        case "WEATHER_UPDATE": {
            newState.weather = mergeDefined(
                newState.weather ?? {},
                {
                    airTempC: delta.airTempC,
                    trackTempC: delta.trackTempC,
                    humidityPct: delta.humidityPct,
                    pressureHpa: delta.pressureHpa,
                    rainfall: delta.rainfall,
                    windDirectionDeg: delta.windDirectionDeg,
                    windSpeedMps: delta.windSpeedMps
                }
            );

            aggregatorLogger.debug("Weather info updated");

            return recalculateRaceStatusCounters(newState);
        }

        case "DRIVER_UPSERT": {
            const driver = getOrCreateDriver(newState, delta.driverId, {
                driverId: delta.driverId,
                racingNumber: delta.racingNumber,
                line: delta.line ?? 0
            });

            const updated: DriverState = {
                ...driver,
                racingNumber: delta.racingNumber ?? driver.racingNumber,
                line: delta.line ?? driver.line,
                identity: mergeIdentity(
                    driver.identity,
                    {
                        tla: delta.tla,
                        broadcastName: delta.broadcastName,
                        fullName: delta.fullName,
                        firstName: delta.firstName,
                        lastName: delta.lastName,
                        teamName: delta.teamName,
                        teamColor: delta.teamColor
                    },
                    "DRIVER_LIST",
                    delta.timestamp
                )
            };

            newState.drivers.set(delta.driverId, updated);
            aggregatorLogger.debug("Driver upsert", {
                driverId: delta.driverId,
            });

            return recalculateRaceStatusCounters(newState);
        }

        case "DRIVER_REMOVE": {
            newState.drivers.delete(delta.driverId);
            aggregatorLogger.debug("Driver removed", {
                driverId: delta.driverId,
            });
            return recalculateRaceStatusCounters(newState);
        }

        case "DRIVER_POSITION_UPDATE": {
            const driver = getOrCreateDriver(newState, delta.driverId);

            const updated: DriverState = {
                ...driver,
                position: delta.position !== undefined ? delta.position : driver.position,
                line: delta.line ?? driver.line,
                showPosition:
                    delta.showPosition == null
                        ? driver.showPosition
                        : delta.showPosition,
                timing: mergeDefined(driver.timing, {
                    gapToLeader: delta.gapToLeader,
                    intervalToAhead: delta.intervalToAhead
                })
            };

            newState.drivers.set(delta.driverId, updated);
            aggregatorLogger.debug("Driver position updated", {
                driverId: delta.driverId,
                showPosition: updated.showPosition
            });

            return recalculateRaceStatusCounters(newState);
        }

        case "DRIVER_TIMING_UPDATE": {
            const driver = getOrCreateDriver(newState, delta.driverId);

            const updated: DriverState = {
                ...driver,
                timing: mergeDefined(driver.timing, {
                    numberOfLaps: delta.numberOfLaps,
                    gapToLeader: delta.gapToLeader,
                    intervalToAhead: delta.intervalToAhead
                })
            };

            newState.drivers.set(delta.driverId, updated);
            aggregatorLogger.debug("Driver timing updated", {
                driverId: delta.driverId,
                timing: updated.timing
            });

            return recalculateRaceStatusCounters(newState);
        }

        case "DRIVER_BEST_LAP_UPDATE": {
            const driver = getOrCreateDriver(newState, delta.driverId);

            const updated: DriverState = {
                ...driver,
                timing: {
                    ...driver.timing,
                    bestLap: delta.bestLap
                        ? mergeDefined(driver.timing.bestLap ?? {}, delta.bestLap)
                        : null
                }
            };

            newState.drivers.set(delta.driverId, updated);
            aggregatorLogger.debug("Driver best lap updated", {
                driverId: delta.driverId,
                bestLap: updated.timing.bestLap
            });

            return recalculateRaceStatusCounters(newState);
        }

        case "DRIVER_LAST_LAP_UPDATE": {
            const driver = getOrCreateDriver(newState, delta.driverId);

            const updated: DriverState = {
                ...driver,
                timing: {
                    ...driver.timing,
                    lastLap: delta.lastLap
                        ? mergeDefined(driver.timing.lastLap ?? {}, delta.lastLap)
                        : null
                }
            };

            newState.drivers.set(delta.driverId, updated);
            aggregatorLogger.debug("Driver last lap updated", {
                driverId: delta.driverId,
                lastLap: updated.timing.lastLap
            });

            return recalculateRaceStatusCounters(newState);
        }

        case "DRIVER_SECTORS_UPDATE": {
            const driver = getOrCreateDriver(newState, delta.driverId);

            const existingSectors = driver.timing.sectors;

            const mergedSectors = delta.sectors.map((incomingSector) => {
                const existingSector = existingSectors.find(
                    (s) => s.sector === incomingSector.sector
                );

                const existingSegments = existingSector?.segments ?? [];

                const mergedSegments = (() => {
                    if (!incomingSector.segments) return existingSegments;

                    const map = new Map<number, { segment: number; statusCode: number }>();

                    // сначала кладем старые
                    for (const seg of existingSegments) {
                        map.set(seg.segment, seg);
                    }

                    // потом обновляем новыми
                    for (const seg of incomingSector.segments) {
                        map.set(seg.segment, {
                            segment: seg.segment,
                            statusCode: seg.statusCode
                        });
                    }

                    return Array.from(map.values()).sort((a, b) => a.segment - b.segment);
                })();

                return {
                    sector: incomingSector.sector,
                    value: incomingSector.value ?? existingSector?.value ?? null,
                    previousValue: incomingSector.previousValue ?? existingSector?.previousValue ?? null,
                    stopped: incomingSector.stopped ?? existingSector?.stopped ?? false,
                    statusCode: incomingSector.statusCode ?? existingSector?.statusCode ?? null,
                    personalFastest:
                        incomingSector.personalFastest ?? existingSector?.personalFastest ?? null,
                    overallFastest:
                        incomingSector.overallFastest ?? existingSector?.overallFastest ?? null,
                    segments: mergedSegments
                };
            });

            const updated: DriverState = {
                ...driver,
                timing: {
                    ...driver.timing,
                    sectors: mergedSectors
                }
            };

            newState.drivers.set(delta.driverId, updated);
            aggregatorLogger.debug("Driver sectors updated", {
                driverId: delta.driverId
            });

            return recalculateRaceStatusCounters(newState);
        }

        case "DRIVER_SPEEDS_UPDATE": {
            const driver = getOrCreateDriver(newState, delta.driverId);

            const updated: DriverState = {
                ...driver,
                timing: {
                    ...driver.timing,
                    speeds: {
                        ...driver.timing.speeds,
                        ...(delta.speeds.i1 !== undefined
                            ? { i1: delta.speeds.i1 ? mergeDefined(driver.timing.speeds.i1 ?? {}, delta.speeds.i1) : null }
                            : {}),
                        ...(delta.speeds.i2 !== undefined
                            ? { i2: delta.speeds.i2 ? mergeDefined(driver.timing.speeds.i2 ?? {}, delta.speeds.i2) : null }
                            : {}),
                        ...(delta.speeds.fl !== undefined
                            ? { fl: delta.speeds.fl ? mergeDefined(driver.timing.speeds.fl ?? {}, delta.speeds.fl) : null }
                            : {}),
                        ...(delta.speeds.st !== undefined
                            ? { st: delta.speeds.st ? mergeDefined(driver.timing.speeds.st ?? {}, delta.speeds.st) : null }
                            : {})
                    }
                }
            };

            newState.drivers.set(delta.driverId, updated);
            aggregatorLogger.debug("Driver speeds updated", {
                driverId: delta.driverId
            });

            return recalculateRaceStatusCounters(newState);
        }

        case "DRIVER_BEST_SPEEDS_UPDATE": {
            const driver = getOrCreateDriver(newState, delta.driverId);

            const currentBestSpeeds = driver.timing.bestSpeeds ?? {};

            const updated: DriverState = {
                ...driver,
                timing: {
                    ...driver.timing,
                    bestSpeeds: delta.bestSpeeds
                        ? {
                            ...currentBestSpeeds,
                            ...(delta.bestSpeeds.i1 !== undefined
                                ? { i1: delta.bestSpeeds.i1 ? mergeDefined(currentBestSpeeds.i1 ?? {}, delta.bestSpeeds.i1) : null }
                                : {}),
                            ...(delta.bestSpeeds.i2 !== undefined
                                ? { i2: delta.bestSpeeds.i2 ? mergeDefined(currentBestSpeeds.i2 ?? {}, delta.bestSpeeds.i2) : null }
                                : {}),
                            ...(delta.bestSpeeds.fl !== undefined
                                ? { fl: delta.bestSpeeds.fl ? mergeDefined(currentBestSpeeds.fl ?? {}, delta.bestSpeeds.fl) : null }
                                : {}),
                            ...(delta.bestSpeeds.st !== undefined
                                ? { st: delta.bestSpeeds.st ? mergeDefined(currentBestSpeeds.st ?? {}, delta.bestSpeeds.st) : null }
                                : {})
                        }
                        : null
                }
            };

            newState.drivers.set(delta.driverId, updated);
            aggregatorLogger.debug("Driver best speed updated", {
                driverId: delta.driverId
            });

            return recalculateRaceStatusCounters(newState);
        }

        case "DRIVER_TYRE_UPDATE": {
            const driver = getOrCreateDriver(newState, delta.driverId);

            const updated: DriverState = {
                ...driver,
                tyres: mergeDefined(driver.tyres, {
                    currentCompound: delta.currentCompound,
                    isNew: delta.isNew,
                    tyreAgeLaps: delta.tyreAgeLaps,
                    tyresNotChanged: delta.tyresNotChanged
                })
            };

            newState.drivers.set(delta.driverId, updated);
            aggregatorLogger.debug("Driver tyres updated", {
                driverId: delta.driverId
            });

            return recalculateRaceStatusCounters(newState);
        }

        case "DRIVER_STINTS_UPDATE": {
            const driver = getOrCreateDriver(newState, delta.driverId);

            const updated: DriverState = {
                ...driver,
                tyres: {
                    ...driver.tyres,
                    stints: delta.stints.map((stint) => ({
                        index: stint.index,
                        compound: stint.compound,
                        isNew: stint.isNew ?? null,
                        totalLaps: stint.totalLaps,
                        startLaps: stint.startLaps,
                        lapFlags: stint.lapFlags ?? null,
                        tyresNotChanged: stint.tyresNotChanged ?? null,
                        referenceLapTime: stint.referenceLapTime ?? null,
                        referenceLapNumber: stint.referenceLapNumber ?? null
                    }))
                }
            };

            newState.drivers.set(delta.driverId, updated);
            aggregatorLogger.debug("Driver stints updated", {
                driverId: delta.driverId
            });

            return recalculateRaceStatusCounters(newState);
        }

        case "DRIVER_TRACK_STATE_UPDATE": {
            const driver = getOrCreateDriver(newState, delta.driverId);

            const updated: DriverState = {
                ...driver,
                track: mergeDefined(driver.track, {
                    inPit: delta.inPit,
                    pitOut: delta.pitOut,
                    stopped: delta.stopped,
                    retired: delta.retired,
                    knockedOut: delta.knockedOut,
                    cutoff: delta.cutoff,
                    statusCode: delta.statusCode
                })
            };

            newState.drivers.set(delta.driverId, updated);
            aggregatorLogger.debug("Driver track state updated", {
                driverId: delta.driverId
            });

            return recalculateRaceStatusCounters(newState);
        }

        case "RACE_CONTROL_MESSAGE_ADD": {
            newState.raceControlMessages = upsertRaceControlMessage(
                newState.raceControlMessages,
                {
                    id: delta.message.id,
                    utc: delta.message.utc,
                    category: delta.message.category,
                    message: delta.message.message,
                    flag: delta.message.flag ?? null,
                    scope: delta.message.scope ?? null,
                    sector: delta.message.sector ?? null,
                    mode: delta.message.mode ?? null
                }
            );

            aggregatorLogger.debug("Race control message add", {
                message: delta.message.category
            });

            return recalculateRaceStatusCounters(newState);
        }

        case "TEAM_RADIO_ADD": {
            newState.teamRadio = upsertTeamRadio(newState.teamRadio, {
                id: delta.radio.id,
                utc: delta.radio.utc,
                driverId: delta.radio.driverId,
                racingNumber: delta.radio.racingNumber,
                path: delta.radio.path
            });

            aggregatorLogger.debug("Team radio add", {
                driver: delta.radio.racingNumber
            });

            return recalculateRaceStatusCounters(newState);
        }

        default: {
            return recalculateRaceStatusCounters(newState);
        }
    }
}
