import { waitForKafka } from "./waitForKafka";
import { waitForPostgres } from "./waitForPostgres";
import { waitForRedis } from "./waitForRedis";

export async function waitForDependencies() {
    console.log("Checking dependencies...");

    await waitForKafka();
    await waitForPostgres();
    await waitForRedis();

    console.log("All dependencies are ready");
}
