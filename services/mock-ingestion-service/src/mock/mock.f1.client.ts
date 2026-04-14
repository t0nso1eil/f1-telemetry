import fs from "fs";
import path from "path";

type Handler = (data: any) => Promise<void>;

export class MockF1Client {
    private handler?: Handler;
    private stopped = false;

    async start(handler: Handler): Promise<void> {
        this.handler = handler;
        this.stopped = false;

        const filePath = path.resolve(__dirname, "../../data/f1_raw_data.json");
        const raw = JSON.parse(fs.readFileSync(filePath, "utf-8"));

        const messages = raw.messages;

        for (const msg of messages) {
            if (this.stopped) break;

            await this.handler({
                timestamp: Date.now(),
                data: msg.data,
            });

            await this.sleep(500);
        }
    }

    async stop(): Promise<void> {
        this.stopped = true;
    }

    private sleep(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
