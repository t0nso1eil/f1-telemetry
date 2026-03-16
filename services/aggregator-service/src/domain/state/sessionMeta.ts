export interface SessionMeta {
    name: string
    type: "Race" | "Qualifying" | "Practice"
    status: "Started" | "Finished" | "Aborted" | "Paused"
    trackName: string
    sessionStartTime?: number
}