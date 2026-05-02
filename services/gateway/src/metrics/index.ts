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

export const snapshotE2ELatency = new client.Histogram({
    name: "gateway_snapshot_e2e_latency_ms",
    help: "End-to-end latency from ingestion to gateway send",
    buckets: [10, 50, 100, 200, 500, 1000, 2000, 5000]
});

export const snapshotIngestionLatency = new client.Histogram({
    name: "gateway_snapshot_ingestion_latency_ms",
    help: "Latency from ingestion to snapshot generation (max ingestion time)",
    buckets: [10, 50, 100, 200, 500, 1000, 5000]
});

export const snapshotAggregatorLatency = new client.Histogram({
    name: "gateway_snapshot_aggregator_latency_ms",
    help: "Latency from aggregator to gateway",
    buckets: [10, 50, 100, 200, 500, 1000, 5000]
});

export function metricsRegistry() {
    return client.register;
}
