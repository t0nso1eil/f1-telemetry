import { createModuleLogger } from "./loggerFactory"

export const parserLogger =
    createModuleLogger("aggregator", "parser")

export const stateLogger =
    createModuleLogger("aggregator", "state")

export const kafkaLogger =
    createModuleLogger("aggregator", "kafka")

export const errorLogger =
    createModuleLogger("aggregator", "errors")