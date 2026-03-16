import axios from "axios";
import WebSocket from "ws";
import { config } from "../config";

type Handler = (data: any) => Promise<void>;

export class F1SignalRClient {
    private connectionToken?: string;
    private cookie?: string;
    private ws?: WebSocket;
    private handler?: Handler;

    async start(handler: Handler) {

        this.handler = handler;

        await this.negotiate();

        await this.connect(); // subscribe теперь внутри connect()

    }

    private async negotiate() {
        const hub = encodeURIComponent(JSON.stringify(config.f1.hub));

        const url =
            `${config.f1.negotiateUrl}?connectionData=${hub}&clientProtocol=1.5`;

        const res = await axios.get(url);

        this.connectionToken = res.data.ConnectionToken;

        this.cookie = Array.isArray(res.headers["set-cookie"])
            ? res.headers["set-cookie"].join("; ")
            : res.headers["set-cookie"];

        console.log("✅ SignalR negotiated");
    }

    private async connect(): Promise<void> {
        return new Promise((resolve, reject) => {

            const hub = encodeURIComponent(JSON.stringify(config.f1.hub));
            const token = encodeURIComponent(this.connectionToken!);

            const url =
                `${config.f1.connectUrl}` +
                `?clientProtocol=1.5` +
                `&transport=webSockets` +
                `&connectionToken=${token}` +
                `&connectionData=${hub}`;

            this.ws = new WebSocket(url, {
                headers: {
                    Cookie: this.cookie!,
                    "User-Agent": "BestHTTP",
                    "Accept-Encoding": "gzip,identity"
                }
            });

            this.ws.on("open", () => {
                console.log("✅ F1 WebSocket connected");

                this.subscribe();   // ← ВАЖНО: теперь тут

                resolve();
            });

            this.ws.on("message", async (data) => {

                try {

                    const parsed = JSON.parse(data.toString());

                    if (!parsed || Object.keys(parsed).length === 0)
                        return;

                    await this.handler?.({
                        timestamp: Date.now(),
                        data: parsed
                    });

                } catch (err) {
                    console.error("Parse error", err);
                }

            });

            this.ws.on("close", () => {

                console.log("⚠ reconnecting...");

                setTimeout(
                    () => this.start(this.handler!),
                    config.f1.reconnectDelay
                );

            });

            this.ws.on("error", reject);

        });
    }

    private subscribe() {
        const streams = [
            "AudioStreams", "DriverList",
            "ExtrapolatedClock", "RaceControlMessages",
            "SessionInfo", "SessionStatus", "TeamRadio",
            "TimingAppData", "TimingStats", "TrackStatus",
            "WeatherData", "Position.z", "CarData.z",
            "ContentStreams", "SessionData", "TimingData",
            "TopThree", "RcmSeries", "LapCount"
        ];

        const msg = {
            H: "Streaming",
            M: "Subscribe",
            A: [streams],
            I: 1
        };

        this.ws!.send(JSON.stringify(msg));

        console.log("✅ Subscribed to streams");
    }
}