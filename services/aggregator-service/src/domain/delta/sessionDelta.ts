export interface SessionDelta {

    type: "SESSION_UPDATE"

    name: string
    status: string

    sessionType: string,
    trackName: string,

    messageId: number
    timestamp: number

}