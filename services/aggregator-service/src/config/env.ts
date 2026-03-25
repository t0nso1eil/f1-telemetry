function requireEnv(name: string, defaultValue?: string): string {
    const value = process.env[name] ?? defaultValue;

    if (!value) {
        throw new Error(`Missing env: ${name}`);
    }

    return value;
}

function parseNumber(name: string, defaultValue?: number): number {
    const raw = process.env[name] ?? String(defaultValue);

    if (!raw) throw new Error(`Missing number env: ${name}`);

    const value = Number(raw);
    if (Number.isNaN(value)) {
        throw new Error(`Invalid number env ${name}: ${raw}`);
    }

    return value;
}

function parseList(name: string, defaultValue?: string[]): string[] {
    const raw = process.env[name];
    if (!raw) return defaultValue ?? [];

    return raw.split(",").map(s => s.trim()).filter(Boolean);
}

export const env = {
    nodeEnv: requireEnv("NODE_ENV", "development"),
    logLevel: requireEnv("LOG_LEVEL", "info"),
    logPretty: requireEnv("LOG_PRETTY", "true") === "true",
    serviceName: requireEnv("SERVICE_NAME", "aggregator-service"),

    kafka: {
        brokers: parseList("KAFKA_BROKERS"),
        clientId: requireEnv("KAFKA_CLIENT_ID"),
        consumerGroup: requireEnv("KAFKA_CONSUMER_GROUP"),
        topicRaw: requireEnv("KAFKA_TOPIC_RAW"),
        topicSnapshot: requireEnv("KAFKA_TOPIC_SNAPSHOT"),
    },

    snapshotIntervalMs: parseNumber("SNAPSHOT_INTERVAL_MS", 2000),
};