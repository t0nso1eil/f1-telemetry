import {DomainDelta} from "./domainDelta";

export interface WeatherDelta extends DomainDelta {
    type: "WEATHER_UPDATE"
    airTemp?: number
    trackTemp?: number
}