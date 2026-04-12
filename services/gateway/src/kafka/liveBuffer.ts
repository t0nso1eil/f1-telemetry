type Snapshot = any; // пока так, потом типизируем

let latestSnapshot: Snapshot | null = null;

export function setLatestSnapshot(snapshot: Snapshot) {
    latestSnapshot = snapshot;
    //console.log("new latest snapshot", latestSnapshot);
}

export function getLatestSnapshot(): Snapshot | null {
    console.log("get live snapshot", latestSnapshot);
    return latestSnapshot;
}
