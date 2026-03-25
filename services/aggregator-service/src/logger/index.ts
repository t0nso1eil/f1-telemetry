import { createModuleLogger } from "./loggerFactory";

export const appLogger = createModuleLogger("app");
export const kafkaLogger = createModuleLogger("kafka");
export const parserLogger = createModuleLogger("parser");
export const aggregatorLogger = createModuleLogger("aggregator");
export const snapshotLogger = createModuleLogger("snapshot");