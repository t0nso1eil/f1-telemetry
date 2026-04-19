import { WebSocketServer, WebSocket } from "ws";
import { addClient, removeClient, setClientDelay } from "./clientRegistry";
import { getLatestSnapshot } from "../kafka/liveBuffer";
import { env } from "../config/env";

export function createWSServer() {
    const wss = new WebSocketServer({
        port: env.port
    });

    wss.on("connection", (ws: WebSocket) => {
        console.log("client connected");

        addClient(ws);

        const snap = getLatestSnapshot();
        if (snap) {
            ws.send(JSON.stringify(snap));
        }

        ws.on("message", (data) => {
            try {
                const msg = JSON.parse(data.toString());

                if (msg.type === "set_delay") {
                    setClientDelay(ws, msg.delay);
                    console.info("delay set:", msg.delay);
                }

            } catch (err) {
                console.error("ws message error", err);
            }
        });

        ws.on("close", () => {
            console.info("client disconnected");
            removeClient(ws);
        });
    });

    console.log(`WebSocket server started on port ${env.port}`);

    return wss;
}
