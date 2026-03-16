import { parseEnvelope } from "./envelopeParser"
import {AggregatorDelta} from "../domain/delta/agregatorDelta";

export function parseRawMessage(raw: any): AggregatorDelta[] {
    return parseEnvelope(raw)
}