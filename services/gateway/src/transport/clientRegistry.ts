import { WebSocket } from "ws";

export type ClientState = {
    delaySeconds: number;
    cursorTime: number; // чтобы двигаться по времени
};

const clients = new Map<WebSocket, ClientState>();

export function addClient(ws: WebSocket) {
    const now = Date.now();

    clients.set(ws, {
        delaySeconds: 0,
        cursorTime: now
    });
}

export function removeClient(ws: WebSocket) {
    clients.delete(ws);
}

export function getClients() {
    return clients;
}

export function setClientDelay(ws: WebSocket, delay: number) {
    const state = clients.get(ws);
    if (!state) return;

    state.delaySeconds = delay;

    state.cursorTime = Date.now() - delay * 1000;
}