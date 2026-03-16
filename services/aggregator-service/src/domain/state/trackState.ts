export interface TrackState {
    status:
        | "GREEN"
        | "YELLOW"
        | "SC"
        | "VSC"
        | "RED"

    sectorFlags: {
        s1?: string
        s2?: string
        s3?: string
    }
}