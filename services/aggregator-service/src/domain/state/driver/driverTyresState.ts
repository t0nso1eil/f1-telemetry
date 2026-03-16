import { TyreStintState } from "./tyreStintState";

export interface DriverTyresState {
    currentCompound: "soft" | "medium" | "hard" | "intermediate" | "wet" | "unknown";
    isNew?: boolean | null;
    tyreAgeLaps?: number | null;
    tyresNotChanged?: boolean | null;

    stints: TyreStintState[];
}