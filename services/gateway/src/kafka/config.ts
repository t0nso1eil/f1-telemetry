export const kafkaConfig = {
    clientId: "gateway-service",

    brokers: [
        "localhost:9092",
        "localhost:9093",
        "localhost:9094"
    ],

    topics: {
        snapshot: "telemetry.snapshot"
    },

    consumerGroup: "gateway-group"
}