import { RaceState } from "./raceState";

export function createInitialState(): RaceState {
    return {
        schemaVersion: 1,

        sessionId: "",
        sequence: 0,

        generatedAt: undefined,
        sourceTimestamp: undefined,

        session: {
            meetingKey: undefined,
            sessionKey: undefined,

            grandPrixName: "",
            officialName: undefined,

            location: undefined,
            countryCode: undefined,
            countryName: undefined,
            circuitShortName: undefined,

            sessionType: "unknown",
            sessionName: "",
            sessionNumber: undefined,
            sessionPart: undefined,
            qualifyingPart: undefined,

            startTime: undefined,
            endTime: undefined,
            gmtOffset: undefined
        },

        raceStatus: {
            sessionStatus: "unknown",
            trackStatus: "unknown",
            trackStatusMessage: undefined,
            clock: {
                utc: 0,
                remainingMs: undefined,
                extrapolating: false
            },
            leaderRacingNumber: undefined,
            totalCars: 0,
            classifiedCars: 0
        },

        weather: {
            airTempC: undefined,
            trackTempC: undefined,
            humidityPct: undefined,
            pressureHpa: undefined,
            rainfall: undefined,
            windDirectionDeg: undefined,
            windSpeedMps: undefined
        },

        drivers: new Map(),

        raceControlMessages: [],
        teamRadio: [],

        lastMessageId: 0,
        lastUpdateTs: 0,

        meta: {
            minIngestionReceivedAt: null,
            maxIngestionReceivedAt: null,
            minAggregatorReceivedAt: null,
            maxAggregatorReceivedAt: null,
        },
    };
}
