import * as dotenv from "dotenv";

dotenv.config();

function required(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing env: ${name}`);
    }
    return value;
}

export const env = {
    nodeEnv: process.env.NODE_ENV || "development",
    port: Number(process.env.PORT || 3000),
    metrics_port: Number(process.env.METRICS_PORT || 3002),

    kafka: {
        brokers: required("KAFKA_BROKERS").split(","),
        clientId: required("KAFKA_CLIENT_ID"),
        groupId: required("KAFKA_GROUP_ID")
    },

    redis: {
        host: required("REDIS_HOST"),
        port: Number(process.env.REDIS_PORT || 6379)
    },

    postgres: {
        host: required("POSTGRES_HOST"),
        port: Number(process.env.POSTGRES_PORT || 5432),
        user: required("POSTGRES_USER"),
        password: required("POSTGRES_PASSWORD"),
        database: required("POSTGRES_DB")
    }
};
