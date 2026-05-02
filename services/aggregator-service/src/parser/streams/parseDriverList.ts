import { AggregatorDelta } from "../../domain/delta/aggregatorDelta";
import { EventMeta } from "../eventMeta";

export function parseDriverList(data: any, timestamp: number, meta: EventMeta): AggregatorDelta[] {
    const deltas: AggregatorDelta[] = [];

    if (!data || typeof data !== "object") {
        return deltas;
    }

    let seq = 0;

    for (const driverId of Object.keys(data)) {
        const driver = data[driverId];
        if (!driver) continue;

        deltas.push({
            type: "DRIVER_UPSERT",
            driverId,
            racingNumber: String(driver.RacingNumber ?? driverId),
            tla: driver.Tla ?? "",
            broadcastName: driver.BroadcastName ?? null,
            fullName: driver.FullName ?? "",
            firstName: driver.FirstName ?? null,
            lastName: driver.LastName ?? null,
            teamName: driver.TeamName ?? "",
            teamColor: driver.TeamColour ?? driver.TeamColor ?? null,
            line: undefined,
            messageId: timestamp * 1000 + seq++,
            timestamp,

            eventId: meta.eventId,
            ingestionReceivedAt: meta.ingestionReceivedAt,
            aggregatorReceivedAt: meta.aggregatorReceivedAt,
        });
    }

    return deltas;
}
