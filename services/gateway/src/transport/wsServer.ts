import { WebSocketServer, WebSocket } from "ws";

export function createWSServer(port: number) {
    const wss = new WebSocketServer({ port });

    wss.on("connection", (ws: WebSocket) => {
        console.log("🔌 client connected");

        ws.on("close", () => {
            console.log("❌ client disconnected");
        });

        ws.on("message", (data) => {
            console.log("📩 message from client:", data.toString());
        });
    });

    console.log(`🚀 WebSocket server started on port ${port}`);

    return wss;
}