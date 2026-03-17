import { AggregatorDelta } from "../../domain/delta/aggregatorDelta";

function toNumber(value: unknown): number | null | undefined {
    if (value === undefined) return undefined;
    if (value === null || value === "") return null;

    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
}

export function parseWeather(data: any, timestamp: number): AggregatorDelta[] {
    return [
        {
            type: "WEATHER_UPDATE",
            airTempC: toNumber(data?.AirTemp),
            trackTempC: toNumber(data?.TrackTemp),
            humidityPct: toNumber(data?.Humidity),
            pressureHpa: toNumber(data?.Pressure),
            rainfall: toNumber(data?.Rainfall),
            windDirectionDeg: toNumber(data?.WindDirection),
            windSpeedMps: toNumber(data?.WindSpeed),
            messageId: timestamp * 1000,
            timestamp
        }
    ];
}