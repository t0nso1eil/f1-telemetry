function requireEnv(name: string, defaultValue?: string): string {
    const value = process.env[name] ?? defaultValue;

    if (value === undefined || value === "") {
        throw new Error(`Missing required env variable: ${name}`);
    }

    return value;
}

function parseNumber(name: string, defaultValue?: number): number {
    const raw = process.env[name] ?? (defaultValue !== undefined ? String(defaultValue) : undefined);

    if (raw === undefined) {
        throw new Error(`Missing required numeric env variable: ${name}`);
    }

    const value = Number(raw);

    if (Number.isNaN(value)) {
        throw new Error(`Invalid numeric env variable ${name}: ${raw}`);
    }

    return value;
}

function parseList(name: string, defaultValue?: string[]): string[] {
    const raw = process.env[name];

    if (!raw || raw.trim() === "") {
        return defaultValue ?? [];
    }

    return raw
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
}

export const env = {
    nodeEnv: requireEnv("NODE_ENV", "development"),
    logLevel: requireEnv("LOG_LEVEL", "info"),
    logPretty: requireEnv("LOG_PRETTY", "true") === "true",

    serviceName: requireEnv("SERVICE_NAME", "ingestion-service"),

    kafka: {
        brokers: parseList("KAFKA_BROKERS", ["localhost:9092"]),
        clientId: requireEnv("KAFKA_CLIENT_ID", "ingestion-service"),
        topicRaw: requireEnv("KAFKA_TOPIC_RAW", "telemetry.raw"),
        retries: parseNumber("KAFKA_RETRIES", 10),
    },

    f1: {
        negotiateUrl: requireEnv(
            "F1_NEGOTIATE_URL",
            "https://livetiming.formula1.com/signalr/negotiate"
        ),
        connectUrl: requireEnv(
            "F1_CONNECT_URL",
            "wss://livetiming.formula1.com/signalr/connect"
        ),
        reconnectDelayMs: parseNumber("F1_RECONNECT_DELAY_MS", 5000),
    },
};