export interface DriverState {
    driverId: string
    number: string
    name: string
    team: string

    position: number
    gapToLeader?: number
    intervalToAhead?: number

    lapsCompleted: number
    lastLapTime?: number
    bestLapTime?: number

    speedTrap?: number
    drsEnabled?: boolean

    tyreCompound?: string
    tyreAgeLaps?: number

    pitStops: number
    inPit: boolean

    retired: boolean
}