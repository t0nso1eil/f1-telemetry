import axios from "axios";
import WebSocket from "ws";
import { config } from "../config/config";
import { f1Logger } from "../logger";
import { HttpProxyAgent } from "http-proxy-agent";
import { HttpsProxyAgent } from "https-proxy-agent";
import http from "http";

type Handler = (data: any) => Promise<void>;

export class F1SignalRClient {
    private connectionToken?: string;
    private cookie?: string;
    private ws?: WebSocket;
    private handler?: Handler;
    private stopped = false;

    private getAgent() {
        if (!config.proxyUrl) {
            f1Logger.warn("Proxy NOT configured");
            return undefined;
        }

        f1Logger.info("Using proxy", { proxyUrl: config.proxyUrl });

        if (config.proxyUrl.startsWith("http://")) {
            return new HttpProxyAgent(config.proxyUrl);
        }

        return new HttpsProxyAgent(config.proxyUrl);
    }

    async start(handler: Handler): Promise<void> {
        this.handler = handler;
        this.stopped = false;

        await this.debugProxy();
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

    private async debugProxy(): Promise<void> {
        try {
            const agent = this.getAgent();

            const direct = await axios.get("https://api.ipify.org?format=json");
            const viaProxy = await axios.get("https://api.ipify.org?format=json", {
                httpAgent: agent,
                httpsAgent: agent,
            });

            f1Logger.info("IP check", {
                direct: direct.data,
                viaProxy: viaProxy.data,
            });
        } catch (err) {
            f1Logger.error("Proxy debug failed", { error: err });
        }
    }

    private async negotiate(): Promise<void> {
        const hub = encodeURIComponent(JSON.stringify(config.f1.hub));
        const url = `${config.f1.negotiateUrl}?connectionData=${hub}&clientProtocol=1.5`;

        const agent = this.getAgent();

        try {
            f1Logger.info("Negotiating SignalR", { url });

            const res = await axios.get(url, {
                httpAgent: agent,
                httpsAgent: agent,
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
                    "Accept": "*/*",
                    "Accept-Language": "en-US,en;q=0.9",
                    "Connection": "keep-alive",
                },
                validateStatus: () => true,
            });

            f1Logger.info("Negotiate response", {
                status: res.status,
                headers: res.headers,
            });

            if (res.status !== 200) {
                throw new Error(`Negotiate failed with status ${res.status}`);
            }

            this.connectionToken = res.data.ConnectionToken;

            this.cookie = Array.isArray(res.headers["set-cookie"])
                ? res.headers["set-cookie"].join("; ")
                : res.headers["set-cookie"];

            f1Logger.info("SignalR negotiated");
        } catch (err: any) {
            f1Logger.error("Negotiate error", {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status,
            });
            throw err;
        }
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

            const agent = this.getAgent();

            f1Logger.info("Connecting WebSocket", { url });

            this.ws = new WebSocket(url, {
                agent: agent as unknown as http.Agent,
                headers: {
                    Cookie: this.cookie!,
                    "User-Agent": "Mozilla/5.0",
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

                    if (!parsed || Object.keys(parsed).length === 0) return;

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
