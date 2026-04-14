type Snapshot = any;

let latestSnapshot: Snapshot | null = null;

type Listener = (snapshot: Snapshot) => void;

const listeners: Listener[] = [];

export function setLatestSnapshot(snapshot: Snapshot) {
    latestSnapshot = snapshot;

    // 🔥 уведомляем всех подписчиков
    for (const listener of listeners) {
        listener(snapshot);
    }
}

export function getLatestSnapshot(): Snapshot | null {
    return latestSnapshot;
}

export function subscribe(listener: Listener) {
    listeners.push(listener);
}
