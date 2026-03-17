export const kafkaConfig = {
    clientId: "aggregator-service",

    brokers: [
        "localhost:9092",
        "localhost:9093",
        "localhost:9094"
    ],

    topics: {
        raw: "telemetry.raw",
        snapshot: "telemetry.snapshot"
    },

    consumerGroup: "aggregator-group"
    //consumerGroup: "aggregator-group-debug-1"
}