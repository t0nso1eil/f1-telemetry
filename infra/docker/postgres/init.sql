CREATE EXTENSION IF NOT EXISTS timescaledb;

CREATE TABLE IF NOT EXISTS snapshots (
                                         id BIGSERIAL,
                                         created_at TIMESTAMPTZ NOT NULL,
                                         data JSONB NOT NULL,
                                         PRIMARY KEY (id, created_at)
    );

SELECT create_hypertable('snapshots', 'created_at', if_not_exists => TRUE);
