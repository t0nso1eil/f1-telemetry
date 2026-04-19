import { waitForKafka } from "./waitForKafka";
import { waitForPostgres } from "./waitForPostgres";
import { waitForRedis } from "./waitForRedis";

export async function waitForDependencies() {
    console.info("Checking dependencies...");

    await waitForKafka();
    await waitForPostgres();
    await waitForRedis();

    console.info("All dependencies are ready");
}
