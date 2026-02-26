export type RaceControlCategory =
    | "INFO"
    | "WARNING"
    | "PENALTY"
    | "SAFETY_CAR";

export interface RaceControlMessage {
    id: string;
    timestamp: number;
    category: RaceControlCategory;
    message: string;
}