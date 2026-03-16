import fs from "fs"
import { parseEnvelope } from "./parser/envelopeParser"

const raw = JSON.parse(
    fs.readFileSync("f1_raw_data.json", "utf8")
)

let total = 0
const allDeltas: any[] = []

for (const message of raw.messages) {

    const deltas = parseEnvelope(message)

    total += deltas.length

    allDeltas.push(...deltas)
}

console.log("messages:", raw.messages.length)
console.log("deltas:", total)


// записываем результат парсинга
fs.writeFileSync(
    "parsed_deltas.json",
    JSON.stringify(allDeltas, null, 2)
)

console.log("file written: parsed_deltas.json")