import { RaceState } from "./raceState";

export function createInitialState(): RaceState {
    return {
        sessionId: "",

        meta: {
            name: "",
            type: "Practice",
            status: "Paused",
            trackName: "",
            sessionStartTime: undefined
        },

        drivers: new Map(),

        timing: {
            currentLap: 0,
            totalLaps: undefined,
            fastestLapOwner: undefined
        },

        track: {
            status: "GREEN",
            sectorFlags: {
                s1: undefined,
                s2: undefined,
                s3: undefined
            }
        },

        weather: {
            airTemp: 0,
            trackTemp: 0
        },

        system: {
            heartbeatTs: 0
        },

        lastMessageId: 0,
        lastUpdateTs: 0
    };
}