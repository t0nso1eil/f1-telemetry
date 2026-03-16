import { DomainDelta } from "../domainDelta";

export interface WeatherDelta extends DomainDelta {
    type: "WEATHER_UPDATE";

    airTempC?: number | null;
    trackTempC?: number | null;
    humidityPct?: number | null;
    pressureHpa?: number | null;
    rainfall?: number | null;
    windDirectionDeg?: number | null;
    windSpeedMps?: number | null;
}