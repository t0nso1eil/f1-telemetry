import client from "prom-client";

client.collectDefaultMetrics();

export const kafkaConnectionGauge = new client.Gauge({
    name: "gateway_kafka_connection_up",
    help: "Kafka connection status",
});

export const wsClientsGauge = new client.Gauge({
    name: "gateway_ws_clients",
    help: "Connected WS clients",
});

export const snapshotsReceived = new client.Counter({
    name: "gateway_snapshots_received_total",
    help: "Snapshots received",
});

export const broadcastErrors = new client.Counter({
    name: "gateway_broadcast_errors_total",
    help: "Broadcast errors",
});

export const cacheHits = new client.Counter({
    name: "gateway_cache_hits_total",
    help: "Cache hits",
    labelNames: ["source"], // live | redis | postgres
});

export function metricsRegistry() {
    return client.register;
}
