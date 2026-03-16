export interface DriverIdentityState {
    tla: string;
    broadcastName?: string | null;

    fullName: string;
    firstName?: string | null;
    lastName?: string | null;

    teamName: string;
    teamColor?: string | null;
}