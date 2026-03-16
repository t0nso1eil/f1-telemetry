import { AggregatorDelta } from "../domain/delta/agregatorDelta";

export function parseStreams(
    snapshot: any,
    timestamp: number
): AggregatorDelta[] {
    const deltas: AggregatorDelta[] = [];
    const messageId = timestamp;

    // WeatherData
    if (snapshot.WeatherData) {
        deltas.push({
            type: "WEATHER_UPDATE",
            airTemp: Number(snapshot.WeatherData.AirTemp ?? 0),
            trackTemp: Number(snapshot.WeatherData.TrackTemp ?? 0),
            messageId,
            timestamp,
        });
    }

    // TrackStatus
    if (snapshot.TrackStatus) {
        deltas.push({
            type: "TRACK_STATUS",
            status: snapshot.TrackStatus.Status ?? "UNKNOWN",
            messageId,
            timestamp,
        });
    }

    return deltas;
}