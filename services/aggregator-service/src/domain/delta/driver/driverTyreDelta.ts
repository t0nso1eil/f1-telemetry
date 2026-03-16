import { DomainDelta } from "../domainDelta";

export interface DriverTyreDelta extends DomainDelta {
    type: "DRIVER_TYRE_UPDATE";

    driverId: string;

    currentCompound?: "soft" | "medium" | "hard" | "intermediate" | "wet" | "unknown";
    isNew?: boolean | null;
    tyreAgeLaps?: number | null;
    tyresNotChanged?: boolean | null;
}