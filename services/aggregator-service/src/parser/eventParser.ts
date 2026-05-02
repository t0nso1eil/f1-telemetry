import { AggregatorDelta } from "../domain/delta/aggregatorDelta";

import { parseDriverList } from "./streams/parseDriverList";
import { parseTimingData } from "./streams/parseTimingData";
import { parseTimingAppData } from "./streams/parseTimingAppData";
import { parseWeather } from "./streams/parseWeather";
import { parseTrackStatus } from "./streams/parseTrackStatus";
import { parseSessionInfo } from "./streams/parseSessionInfo";
import { parseSessionStatus } from "./streams/parseSessionStatus";
import { parseRaceControlMessages } from "./streams/parseRaceControlMessages";
import { parseTeamRadio } from "./streams/parseTeamRadio";
import { parserLogger } from "../logger";
import { parserErrorsTotal, parserEventsTotal } from "../metrics";
import { parseSessionData } from "./streams/parseSessionData";

export function parseNormalizedEvent(event: any): AggregatorDelta[] {
    const ingestionReceivedAt = Number(event.sourceReceivedAt ?? event.timestamp);
    const aggregatorReceivedAt = Date.now();

    const deltas: AggregatorDelta[] = [];

    if (!event) {
        parserLogger.warn("parseNormalizedEvent: empty event");
        return deltas;
    }

    const stream = event.stream;
    const payload = event.payload;
    const timestamp = Number(event.timestamp ?? Date.now());

    parserLogger.debug({
        message: "event received",
        stream,
        timestamp
    });
    parserEventsTotal.inc({ stream });

    if (!payload) {
        parserLogger.warn({
            message: "event without payload",
            stream
        });

        return deltas;
    }

    try {
        switch (stream) {
            case "DriverList":
                return parseDriverList(payload, timestamp, {
                    eventId: event.eventId,
                    ingestionReceivedAt,
                    aggregatorReceivedAt,
                });

            case "TimingData":
                return parseTimingData(payload, timestamp, {
                    eventId: event.eventId,
                    ingestionReceivedAt,
                    aggregatorReceivedAt,
                });

            case "TimingAppData":
                return parseTimingAppData(payload, timestamp, {
                    eventId: event.eventId,
                    ingestionReceivedAt,
                    aggregatorReceivedAt,
                });

            case "WeatherData":
                return parseWeather(payload, timestamp, {
                    eventId: event.eventId,
                    ingestionReceivedAt,
                    aggregatorReceivedAt,
                });

            case "TrackStatus":
                return parseTrackStatus(payload, timestamp, {
                    eventId: event.eventId,
                    ingestionReceivedAt,
                    aggregatorReceivedAt,
                });

            case "SessionInfo":
                return parseSessionInfo(payload, timestamp, {
                    eventId: event.eventId,
                    ingestionReceivedAt,
                    aggregatorReceivedAt,
                });

            case "SessionStatus":
                return parseSessionStatus(payload, timestamp, {
                    eventId: event.eventId,
                    ingestionReceivedAt,
                    aggregatorReceivedAt,
                });

            case "RaceControlMessages":
                return parseRaceControlMessages(payload, timestamp, {
                    eventId: event.eventId,
                    ingestionReceivedAt,
                    aggregatorReceivedAt,
                });

            case "SessionData":
                return parseSessionData(payload, timestamp, {
                    eventId: event.eventId,
                    ingestionReceivedAt,
                    aggregatorReceivedAt,
                });

            case "TeamRadio":
                return parseTeamRadio(payload, timestamp, {
                    eventId: event.eventId,
                    ingestionReceivedAt,
                    aggregatorReceivedAt,
                });

            default:
                parserLogger.debug({
                    message: "unknown stream skipped",
                    stream
                });
                return deltas;
        }
    } catch (err) {
        parserLogger.error({
            message: "parser error",
            stream,
            error: err
        });
        parserErrorsTotal.inc({ stream });

        return deltas;
    }
}
