export interface RaceControlMessageState {
    id: string;
    utc: number; // epoch millis UTC

    category: string;
    message: string;

    flag?: string | null;
    scope?: string | null;
    sector?: number | null;
    mode?: string | null;
}