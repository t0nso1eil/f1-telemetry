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

export function parseNormalizedEvent(event: any): AggregatorDelta[] {
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
                return parseDriverList(payload, timestamp);

            case "TimingData":
                return parseTimingData(payload, timestamp);

            case "TimingAppData":
                return parseTimingAppData(payload, timestamp);

            case "WeatherData":
                return parseWeather(payload, timestamp);

            case "TrackStatus":
                return parseTrackStatus(payload, timestamp);

            case "SessionInfo":
                return parseSessionInfo(payload, timestamp);

            case "SessionStatus":
                return parseSessionStatus(payload, timestamp);

            case "RaceControlMessages":
                return parseRaceControlMessages(payload, timestamp);

            case "TeamRadio":
                return parseTeamRadio(payload, timestamp);

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
