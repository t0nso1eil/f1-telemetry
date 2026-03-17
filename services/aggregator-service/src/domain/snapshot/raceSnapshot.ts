export interface RaceSnapshot {
    schema_version: number;
    session_key: string;
    sequence: number;
    generated_at: string;
    source_timestamp: string | null;
    interval_ms: 2000;

    session: unknown;
    race_state: unknown;
    weather: unknown;
    drivers: unknown[];
    race_control_messages: unknown[];
    team_radio: unknown[];
}