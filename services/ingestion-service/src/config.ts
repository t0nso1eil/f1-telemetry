export const config = {
    kafka: {
        brokers: ["localhost:9092"],
        clientId: "ingestion-service",
        topic: "telemetry.raw"
    },

    f1: {
        negotiateUrl:
            "https://livetiming.formula1.com/signalr/negotiate",
        connectUrl:
            "wss://livetiming.formula1.com/signalr/connect",
        hub: [{ name: "Streaming" }],
        reconnectDelay: 5000
    }
};