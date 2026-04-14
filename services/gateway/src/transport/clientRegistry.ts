import { WebSocket } from "ws";

export type ClientState = {
    delaySeconds: number;
};

const clients = new Map<WebSocket, ClientState>();

export function addClient(ws: WebSocket) {
    clients.set(ws, {
        delaySeconds: 0
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
}
