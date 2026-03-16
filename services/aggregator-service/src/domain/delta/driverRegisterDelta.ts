export interface DriverRegisterDelta {

    type: "DRIVER_REGISTER"

    driverId: string
    number: string
    name: string
    team: string

    messageId: number
    timestamp: number

}