import { methods } from "../src/shared";
import { sleep } from "../src/shared/utils";

const CONCURRENT_USERS = 5000;
const CONCURRENCY_MAX_LATENCY = 10; // ms
const type: methods = "externalCallsWithTransaction";

(async function () {
  const API = `http://localhost:3000/orders?type=${type}`;
  const requests = await Promise.allSettled(
    Array(CONCURRENT_USERS)
      .fill(undefined)
      .map(async () => {
        await sleep(Math.random() * CONCURRENCY_MAX_LATENCY);
        const response = await fetch(API, {
          method: "POST",
        });
        if (response.status >= 400) {
          throw new Error();
        }
      }),
  );
  console.log(`${CONCURRENT_USERS} requests made with ${type} approach:`);
  console.log({
    success: requests.filter((r) => r.status === "fulfilled").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  });
})();
