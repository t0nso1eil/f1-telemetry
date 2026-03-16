import { DomainDelta } from "../domainDelta";

export interface DriverUpsertDelta extends DomainDelta {
    type: "DRIVER_UPSERT";

    driverId: string;         // внутренний ключ агрегатора, обычно racing number
    racingNumber: string;

    tla?: string;
    broadcastName?: string | null;
    fullName?: string;
    firstName?: string | null;
    lastName?: string | null;

    teamName?: string;
    teamColor?: string | null;

    line?: number | null;
}