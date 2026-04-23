import axios from "axios";
import WebSocket from "ws";
import { config } from "../config/config";
import { f1Logger } from "../logger";
import { HttpsProxyAgent } from "https-proxy-agent";

type Handler = (data: any) => Promise<void>;

export class F1SignalRClient {
    private connectionToken?: string;
    private cookie?: string;
    private ws?: WebSocket;
    private handler?: Handler;
    private stopped = false;

    async start(handler: Handler): Promise<void> {
        this.handler = handler;
        this.stopped = false;

        await this.negotiate();
        await this.connect();
    }

    async stop(): Promise<void> {
        this.stopped = true;

        if (this.ws) {
            this.ws.removeAllListeners();
            this.ws.close();
            this.ws = undefined;
        }

        f1Logger.info("F1 client stopped");
    }

    private async negotiate(): Promise<void> {
        const hub = encodeURIComponent(JSON.stringify(config.f1.hub));
        const url = `${config.f1.negotiateUrl}?connectionData=${hub}&clientProtocol=1.5`;

        const agent = config.proxyUrl
            ? new HttpsProxyAgent(config.proxyUrl)
            : undefined;

        const res = await axios.get(url, {
            httpsAgent: agent,
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Accept": "*/*",
            },
        });

        this.connectionToken = res.data.ConnectionToken;
        this.cookie = Array.isArray(res.headers["set-cookie"])
            ? res.headers["set-cookie"].join("; ")
            : res.headers["set-cookie"];

        f1Logger.info("SignalR negotiated");
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

            const agent = config.proxyUrl
                ? new HttpsProxyAgent(config.proxyUrl)
                : undefined;

            this.ws = new WebSocket(url, {
                agent,
                headers: {
                    Cookie: this.cookie!,
                    "User-Agent": "BestHTTP",
                    "Accept-Encoding": "gzip,identity",
                },
            });

            this.ws.on("open", () => {
                f1Logger.info("F1 WebSocket connected");
                this.subscribe();
                resolve();
            });

            this.ws.on("message", async (data) => {
                try {
                    const parsed = JSON.parse(data.toString());

                    if (!parsed || Object.keys(parsed).length === 0) {
                        return;
                    }

                    await this.handler?.({
                        timestamp: Date.now(),
                        data: parsed,
                    });
                } catch (err) {
                    f1Logger.error("WebSocket message parse error", { error: err });
                }
            });

            this.ws.on("close", () => {
                if (this.stopped) {
                    f1Logger.info("WebSocket closed after stop");
                    return;
                }

                f1Logger.warn("WebSocket closed, reconnecting", {
                    delayMs: config.f1.reconnectDelayMs,
                });

                setTimeout(() => {
                    if (!this.stopped && this.handler) {
                        void this.start(this.handler);
                    }
                }, config.f1.reconnectDelayMs);
            });

            this.ws.on("error", (err) => {
                f1Logger.error("WebSocket error", { error: err });
                reject(err);
            });
        });
    }

    private subscribe(): void {
        const streams = [
            "AudioStreams",
            "DriverList",
            "ExtrapolatedClock",
            "RaceControlMessages",
            "SessionInfo",
            "SessionStatus",
            "TeamRadio",
            "TimingAppData",
            "TimingStats",
            "TrackStatus",
            "WeatherData",
            "Position.z",
            "CarData.z",
            "ContentStreams",
            "SessionData",
            "TimingData",
            "TopThree",
            "RcmSeries",
            "LapCount",
        ];

        const msg = {
            H: "Streaming",
            M: "Subscribe",
            A: [streams],
            I: 1,
        };

        this.ws?.send(JSON.stringify(msg));

        f1Logger.info("Subscribed to F1 streams", {
            streamsCount: streams.length,
        });
    }
}
