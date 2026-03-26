type Snapshot = any; // пока так, потом типизируем

let latestSnapshot: Snapshot | null = null;

export function setLatestSnapshot(snapshot: Snapshot) {
    latestSnapshot = snapshot;
}

export function getLatestSnapshot(): Snapshot | null {
    return latestSnapshot;
}