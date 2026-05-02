import { AggregatorDelta } from "../../domain/delta/aggregatorDelta";
import {EventMeta} from "../eventMeta";

function toNumber(value: unknown): number | null | undefined {
    if (value === undefined) return undefined;
    if (value === null || value === "") return null;

    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
}

function toBoolean(value: unknown): boolean | undefined {
    if (value === undefined || value === null || value === "") return undefined;
    if (typeof value === "boolean") return value;
    if (value === "true") return true;
    if (value === "false") return false;
    return undefined;
}

export function parseTimingData(data: any, timestamp: number, meta: EventMeta): AggregatorDelta[] {
    const deltas: AggregatorDelta[] = [];

    if (!data?.Lines) {
        return deltas;
    }

    let seq = 0;

    if (data?.SessionPart !== undefined) {
        deltas.push({
            type: "SESSION_INFO_UPDATE",
            sessionPart: toNumber(data.SessionPart) ?? undefined,
            messageId: timestamp * 1000 + seq++,
            timestamp,

            eventId: meta.eventId,
            ingestionReceivedAt: meta.ingestionReceivedAt,
            aggregatorReceivedAt: meta.aggregatorReceivedAt,
        });
    }

    for (const driverId of Object.keys(data.Lines)) {
        const line = data.Lines[driverId];
        if (!line) continue;

        if (
            line.Position !== undefined ||
            line.Line !== undefined ||
            line.ShowPosition !== undefined ||
            line.GapToLeader !== undefined ||
            line.IntervalToPositionAhead?.Value !== undefined
        ) {
            deltas.push({
                type: "DRIVER_POSITION_UPDATE",
                driverId,
                position: toNumber(line.Position),
                line: toNumber(line.Line),
                showPosition: toBoolean(line.ShowPosition),
                gapToLeader: line.GapToLeader ?? null,
                intervalToAhead: line.IntervalToPositionAhead?.Value ?? null,
                messageId: timestamp * 1000 + seq++,
                timestamp,

                eventId: meta.eventId,
                ingestionReceivedAt: meta.ingestionReceivedAt,
                aggregatorReceivedAt: meta.aggregatorReceivedAt,
            });
        }

        if (
            line.NumberOfLaps !== undefined ||
            line.GapToLeader !== undefined ||
            line.IntervalToPositionAhead?.Value !== undefined
        ) {
            deltas.push({
                type: "DRIVER_TIMING_UPDATE",
                driverId,
                numberOfLaps: toNumber(line.NumberOfLaps),
                gapToLeader: line.GapToLeader ?? null,
                intervalToAhead: line.IntervalToPositionAhead?.Value ?? null,
                messageId: timestamp * 1000 + seq++,
                timestamp,

                eventId: meta.eventId,
                ingestionReceivedAt: meta.ingestionReceivedAt,
                aggregatorReceivedAt: meta.aggregatorReceivedAt,
            });
        }

        if (line.LastLapTime !== undefined) {
            deltas.push({
                type: "DRIVER_LAST_LAP_UPDATE",
                driverId,
                lastLap: line.LastLapTime
                    ? {
                        value: line.LastLapTime.Value ?? null,
                        lap: toNumber(line.NumberOfLaps),
                        statusCode: toNumber(line.LastLapTime.Status),
                        personalFastest: toBoolean(line.LastLapTime.PersonalFastest),
                        overallFastest: toBoolean(line.LastLapTime.OverallFastest)
                    }
                    : null,
                messageId: timestamp * 1000 + seq++,
                timestamp,

                eventId: meta.eventId,
                ingestionReceivedAt: meta.ingestionReceivedAt,
                aggregatorReceivedAt: meta.aggregatorReceivedAt,
            });
        }

        if (line.BestLapTime !== undefined) {
            deltas.push({
                type: "DRIVER_BEST_LAP_UPDATE",
                driverId,
                bestLap: line.BestLapTime
                    ? {
                        value: line.BestLapTime.Value ?? null,
                        lap: toNumber(line.BestLapTime.Lap),
                        statusCode: toNumber(line.BestLapTime.Status),
                        personalFastest: toBoolean(line.BestLapTime.PersonalFastest),
                        overallFastest: toBoolean(line.BestLapTime.OverallFastest)
                    }
                    : null,
                messageId: timestamp * 1000 + seq++,
                timestamp,

                eventId: meta.eventId,
                ingestionReceivedAt: meta.ingestionReceivedAt,
                aggregatorReceivedAt: meta.aggregatorReceivedAt,
            });
        }

        if (line.Sectors) {
            const sectors = Object.keys(line.Sectors)
                .map((sectorKey) => {
                    const sector = line.Sectors[sectorKey];
                    if (!sector) return null;

                    return {
                        sector: (Number(sectorKey) + 1) as 1 | 2 | 3,
                        value: sector.Value ?? null,
                        previousValue: sector.PreviousValue ?? null,
                        stopped: Boolean(sector.Stopped ?? false),
                        statusCode: toNumber(sector.Status),
                        personalFastest: toBoolean(sector.PersonalFastest),
                        overallFastest: toBoolean(sector.OverallFastest),
                        segments: sector.Segments
                            ? Object.keys(sector.Segments).map((segmentKey) => ({
                                segment: Number(segmentKey),
                                statusCode: Number(sector.Segments[segmentKey]?.Status ?? 0)
                            }))
                            : []
                    };
                })
                .filter(Boolean) as Array<{
                sector: 1 | 2 | 3;
                value?: string | null;
                previousValue?: string | null;
                stopped?: boolean;
                statusCode?: number | null;
                personalFastest?: boolean | null;
                overallFastest?: boolean | null;
                segments?: Array<{ segment: number; statusCode: number }>;
            }>;

            deltas.push({
                type: "DRIVER_SECTORS_UPDATE",
                driverId,
                sectors,
                messageId: timestamp * 1000 + seq++,
                timestamp,

                eventId: meta.eventId,
                ingestionReceivedAt: meta.ingestionReceivedAt,
                aggregatorReceivedAt: meta.aggregatorReceivedAt,
            });
        }

        if (line.Speeds) {
            deltas.push({
                type: "DRIVER_SPEEDS_UPDATE",
                driverId,
                speeds: {
                    i1: line.Speeds.I1
                        ? {
                            value: toNumber(line.Speeds.I1.Value),
                            statusCode: toNumber(line.Speeds.I1.Status),
                            personalFastest: toBoolean(line.Speeds.I1.PersonalFastest),
                            overallFastest: toBoolean(line.Speeds.I1.OverallFastest)
                        }
                        : undefined,
                    i2: line.Speeds.I2
                        ? {
                            value: toNumber(line.Speeds.I2.Value),
                            statusCode: toNumber(line.Speeds.I2.Status),
                            personalFastest: toBoolean(line.Speeds.I2.PersonalFastest),
                            overallFastest: toBoolean(line.Speeds.I2.OverallFastest)
                        }
                        : undefined,
                    fl: line.Speeds.FL
                        ? {
                            value: toNumber(line.Speeds.FL.Value),
                            statusCode: toNumber(line.Speeds.FL.Status),
                            personalFastest: toBoolean(line.Speeds.FL.PersonalFastest),
                            overallFastest: toBoolean(line.Speeds.FL.OverallFastest)
                        }
                        : undefined,
                    st: line.Speeds.ST
                        ? {
                            value: toNumber(line.Speeds.ST.Value),
                            statusCode: toNumber(line.Speeds.ST.Status),
                            personalFastest: toBoolean(line.Speeds.ST.PersonalFastest),
                            overallFastest: toBoolean(line.Speeds.ST.OverallFastest)
                        }
                        : undefined
                },
                messageId: timestamp * 1000 + seq++,
                timestamp,

                eventId: meta.eventId,
                ingestionReceivedAt: meta.ingestionReceivedAt,
                aggregatorReceivedAt: meta.aggregatorReceivedAt,
            });
        }

        if (
            line.InPit !== undefined ||
            line.PitOut !== undefined ||
            line.Stopped !== undefined ||
            line.Retired !== undefined ||
            line.KnockedOut !== undefined ||
            line.Cutoff !== undefined ||
            line.Status !== undefined
        ) {
            deltas.push({
                type: "DRIVER_TRACK_STATE_UPDATE",
                driverId,
                inPit: toBoolean(line.InPit),
                pitOut: toBoolean(line.PitOut),
                stopped: toBoolean(line.Stopped),
                retired: toBoolean(line.Retired),
                knockedOut: toBoolean(line.KnockedOut),
                cutoff: toBoolean(line.Cutoff),
                statusCode: toNumber(line.Status),
                messageId: timestamp * 1000 + seq++,
                timestamp,

                eventId: meta.eventId,
                ingestionReceivedAt: meta.ingestionReceivedAt,
                aggregatorReceivedAt: meta.aggregatorReceivedAt,
            });
        }
    }

    return deltas;
}
