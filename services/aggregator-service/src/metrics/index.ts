import client, {Histogram} from "prom-client";

client.collectDefaultMetrics();

export const kafkaConnectionGauge = new client.Gauge({
    name: "kafka_connection_up",
    help: "Kafka connection status (1 = up, 0 = down)",
});

export const messagesTotal = new client.Counter({
    name: "aggregator_messages_total",
    help: "Total messages processed",
});

export const deltasTotal = new client.Counter({
    name: "aggregator_deltas_total",
    help: "Total deltas processed",
});

export const snapshotsTotal = new client.Counter({
    name: "aggregator_snapshots_total",
    help: "Snapshots published",
});

export const driversGauge = new client.Gauge({
    name: "aggregator_drivers_count",
    help: "Current number of drivers in state",
});

export const processingErrors = new client.Counter({
    name: "aggregator_processing_errors_total",
    help: "Processing errors",
});

export const snapshotErrors = new client.Counter({
    name: "aggregator_snapshot_errors_total",
    help: "Snapshot publish errors",
});

export const parserEventsTotal = new client.Counter({
    name: "parser_events_total",
    help: "Total events received",
    labelNames: ["stream"],
});

export const parserErrorsTotal = new client.Counter({
    name: "parser_errors_total",
    help: "Parser errors",
    labelNames: ["stream"],
});

export const fallbackAppliedTotal = new client.Counter({
    name: "aggregator_fallback_applied_total",
    help: "Fallback applied to drivers",
});

export const deltaByType = new client.Counter({
    name: "aggregator_deltas_by_type_total",
    help: "Deltas by type",
    labelNames: ["type"],
});

export const snapshotSizeBytes = new Histogram({
    name: "snapshot_size_bytes",
    help: "Snapshot size in bytes",
    buckets: [1000, 5000, 10000, 50000, 100000],
});

export function metricsRegistry() {
    return client.register;
}
