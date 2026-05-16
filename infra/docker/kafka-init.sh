#!/bin/bash

set -e

echo "Waiting for Kafka..."

cub kafka-ready -b kafka-1:29092 1 60

echo "Creating telemetry.raw"

kafka-topics --create --if-not-exists \
  --topic telemetry.raw \
  --bootstrap-server kafka-1:29092 \
  --replication-factor 3 \
  --partitions 6 \
  --config retention.ms=86400000 \
  --config min.insync.replicas=2

echo "Creating telemetry.snapshot"

kafka-topics --create --if-not-exists \
  --topic telemetry.snapshot \
  --bootstrap-server kafka-1:29092 \
  --replication-factor 3 \
  --partitions 3 \
  --config retention.ms=-1

echo "Creating system.logs"

kafka-topics --create --if-not-exists \
  --topic system.logs \
  --bootstrap-server kafka-1:29092 \
  --replication-factor 3 \
  --partitions 3 \
  --config retention.ms=604800000

echo "Done"
