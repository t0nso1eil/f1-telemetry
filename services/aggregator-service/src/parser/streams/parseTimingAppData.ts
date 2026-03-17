import { AggregatorDelta } from "../../domain/delta/aggregatorDelta";

function toNumber(value: unknown): number | null | undefined {
    if (value === undefined) return undefined;
    if (value === null || value === "") return null;

    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
}

function toBoolean(value: unknown): boolean | undefined {
    if (value === undefined || value === null || value === "") return undefined;
    if (typeof value === "boolean") return value;
    if (value === "true") return true;
    if (value === "false") return false;
    return undefined;
}

function mapCompound(value?: string) {
    const v = String(value ?? "").toLowerCase();

    if (v === "soft") return "soft" as const;
    if (v === "medium") return "medium" as const;
    if (v === "hard") return "hard" as const;
    if (v === "intermediate") return "intermediate" as const;
    if (v === "wet") return "wet" as const;

    return "unknown" as const;
}

export function parseTimingAppData(data: any, timestamp: number): AggregatorDelta[] {
    const deltas: AggregatorDelta[] = [];
    if (!data?.Lines) return deltas;

    let seq = 0;

    for (const driverId of Object.keys(data.Lines)) {
        const line = data.Lines[driverId];
        if (!line) continue;

        const stintsArray = line.Stints
            ? Object.keys(line.Stints)
                .map((stintKey) => {
                    const stint = line.Stints[stintKey];
                    if (!stint) return null;

                    return {
                        index: Number(stintKey),
                        compound: mapCompound(stint.Compound),
                        isNew: toBoolean(stint.New),
                        totalLaps: Number(stint.TotalLaps ?? 0),
                        startLaps: Number(stint.StartLaps ?? 0),
                        lapFlags: toNumber(stint.LapFlags),
                        tyresNotChanged: toBoolean(stint.TyresNotChanged),
                        referenceLapTime: stint.LapTime ?? null,
                        referenceLapNumber: toNumber(stint.LapNumber)
                    };
                })
                .filter(Boolean)
            : [];

        if (stintsArray.length > 0) {
            const currentStint = stintsArray[stintsArray.length - 1];

            deltas.push({
                type: "DRIVER_TYRE_UPDATE",
                driverId,
                currentCompound: currentStint?.compound ?? "unknown",
                isNew: currentStint?.isNew,
                tyreAgeLaps: currentStint?.totalLaps ?? null,
                tyresNotChanged: currentStint?.tyresNotChanged,
                messageId: timestamp * 1000 + seq++,
                timestamp
            });

            deltas.push({
                type: "DRIVER_STINTS_UPDATE",
                driverId,
                stints: stintsArray as Array<{
                    index: number;
                    compound: "soft" | "medium" | "hard" | "intermediate" | "wet" | "unknown";
                    isNew?: boolean | null;
                    totalLaps: number;
                    startLaps: number;
                    lapFlags?: number | null;
                    tyresNotChanged?: boolean | null;
                    referenceLapTime?: string | null;
                    referenceLapNumber?: number | null;
                }>,
                messageId: timestamp * 1000 + seq++,
                timestamp
            });
        }
    }

    return deltas;
}