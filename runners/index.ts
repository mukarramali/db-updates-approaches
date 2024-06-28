import { methods } from "../src/shared";
import { sleep } from "../src/shared/utils";

const CONCURRENT_USERS = 1000;
const CONCURRENCY_MAX_LATENCY = 1; // ms
const type: methods = "failureStepsWithTransaction";

(async function () {
  const API = `http://localhost:3000/orders?type=${type}`;
  const requests = await Promise.allSettled(
    Array(CONCURRENT_USERS)
      .fill(undefined)
      .map(async () => {
        await wait();
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
