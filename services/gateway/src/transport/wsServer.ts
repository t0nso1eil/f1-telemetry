import { WebSocketServer, WebSocket } from "ws";
import { addClient, removeClient, setClientDelay } from "./clientRegistry";
import { getLatestSnapshot } from "../kafka/liveBuffer";
import { env } from "../config/env";
import { createLogger } from "../logger/logger";

const logger = createLogger("broadcast");

export function createWSServer() {
    const wss = new WebSocketServer({
        port: env.port
    });

    wss.on("connection", (ws: WebSocket) => {
        logger.info("Client connected");

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
                    logger.info(msg.delay, "Delay set:");
                }

            } catch (err) {
                logger.error({ err }, "Parse error");
            }
        });

        ws.on("close", () => {
            console.info("Client disconnected");
            removeClient(ws);
        });
    });

    logger.info(`WebSocket server started on port ${env.port}`);

    return wss;
}
