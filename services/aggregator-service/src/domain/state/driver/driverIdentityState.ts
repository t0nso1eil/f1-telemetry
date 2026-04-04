import {IdentitySource} from "../../meta/identitySource";

export interface DriverIdentityState {
    tla: string | null;
    broadcastName?: string | null;

    fullName: string | null;
    firstName?: string | null;
    lastName?: string | null;

    teamName: string | null;
    teamColor?: string | null;

    meta: {
        source: IdentitySource;
        updatedAt: number;
    };
}