export interface RaceSnapshot {
    session_key: string;
    generated_at: string;
    source_timestamp: string | null;

    session: unknown;
    race_state: unknown;
    weather: unknown;
    drivers: unknown[];
    race_control_messages: unknown[];
    team_radio: unknown[];

    meta: {
        ingestion_min: string | null;
        ingestion_max: string | null;

        aggregator_min: string | null;
        aggregator_max: string | null;
    };
}
