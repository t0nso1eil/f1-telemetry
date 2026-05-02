import WebSocket from "ws";

const TARGET = "ws://111.88.246.224:3000";

const TOTAL_CLIENTS = 100;
const CONNECT_DELAY_MS = 5; // чтобы не дудосить сервер резко

function randomDelay() {
    const r = Math.random();

    if (r < 0.6) return 0; // лайв
    if (r < 0.8) return 5; // почти лайв
    if (r < 0.95) return 30; // небольшая задержка
    return 120; // архив
}

function createClient(id) {
    const ws = new WebSocket(TARGET);

    ws.on("open", () => {
        const delay = randomDelay();

        ws.send(JSON.stringify({
            type: "set_delay",
            delay
        }));

        console.log(`Client ${id} connected (delay=${delay})`);
    });

    ws.on("message", () => {
        // заглушка
    });

    ws.on("close", () => {
        console.log(`Client ${id} disconnected`);
    });

    ws.on("error", (err) => {
        console.error(`Client ${id} error`, err.message);
    });
}

async function run() {
    for (let i = 0; i < TOTAL_CLIENTS; i++) {
        createClient(i);

        await new Promise(r => setTimeout(r, CONNECT_DELAY_MS));
    }
}

run();
