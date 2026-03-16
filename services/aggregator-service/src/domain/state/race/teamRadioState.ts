export interface TeamRadioState {
    id: string;
    utc: number; // epoch millis UTC

    driverId: string;
    racingNumber: string;

    path: string;
}