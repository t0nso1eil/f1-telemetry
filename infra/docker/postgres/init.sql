CREATE TABLE IF NOT EXISTS snapshots (
                                         id SERIAL PRIMARY KEY,
                                         created_at TIMESTAMP NOT NULL,
                                         data JSONB NOT NULL
);
