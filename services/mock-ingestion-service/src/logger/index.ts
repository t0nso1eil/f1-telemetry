import { createModuleLogger } from "./loggerFactory";

export const appLogger = createModuleLogger("app");
export const f1Logger = createModuleLogger("f1");
export const kafkaLogger = createModuleLogger("kafka");
export const parserLogger = createModuleLogger("parser");
export const normalizerLogger = createModuleLogger("normalizer");