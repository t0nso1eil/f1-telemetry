import { AggregatorDelta } from "../domain/delta/agregatorDelta";

export function parseDeltaString(
    deltaString: string,
    timestamp: number
): AggregatorDelta[] {
    const deltas: AggregatorDelta[] = [];

    const parts = deltaString.split("|");
    let messageId = timestamp; // Можно заменить на auto increment или реальное messageId

    for (const part of parts) {
        if (!part) continue;

        // Изменение позиции водителя
        if (part.startsWith("POS:")) {
            const [, driverId, position] = part.split(":");
            if (driverId && position) {
                deltas.push({
                    type: "DRIVER_POSITION",
                    driverId,
                    position: Number(position),
                    messageId,
                    timestamp,
                });
            }
        }

        // Обновление погоды
        if (part.startsWith("WEATHER:")) {
            const [, airTemp] = part.split(":");
            if (airTemp) {
                deltas.push({
                    type: "WEATHER_UPDATE",
                    airTemp: Number(airTemp),
                    messageId,
                    timestamp,
                });
            }
        }

        messageId++;
    }

    return deltas;
}