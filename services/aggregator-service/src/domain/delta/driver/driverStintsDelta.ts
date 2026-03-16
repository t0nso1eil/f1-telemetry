import { DomainDelta } from "../domainDelta";

export interface DriverStintsDelta extends DomainDelta {
    type: "DRIVER_STINTS_UPDATE";

    driverId: string;

    stints: Array<{
        index: number;
        compound: "soft" | "medium" | "hard" | "intermediate" | "wet" | "unknown";
        isNew?: boolean | null;
        totalLaps: number;
        startLaps: number;
        lapFlags?: number | null;
        tyresNotChanged?: boolean | null;
        referenceLapTime?: string | null;
        referenceLapNumber?: number | null;
    }>;
}