export function resolveSource(delaySeconds: number) {
    if (delaySeconds <= 2) return "live";
    if (delaySeconds <= 60) return "redis";
    return "postgres";
}