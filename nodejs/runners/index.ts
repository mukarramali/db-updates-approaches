import { methods } from "../src/shared";
import { sleep } from "../src/shared/utils";

const CONCURRENT_USERS = 700;
const CONCURRENCY_MAX_LATENCY = 10; // ms
const type: methods = "failureStepsWithTransaction";

(async function () {
  const API = `http://localhost:3000/orders?type=${type}`;
  const requests = await Promise.allSettled(
    Array(CONCURRENT_USERS)
      .fill(undefined)
      .map(async () => {
        await sleep(Math.random() * CONCURRENCY_MAX_LATENCY);
        let response: Response;
        try {
          response = await fetch(API, {
            method: "POST",
          });
        } catch (error) {
          countRejection("API error");
          throw error;
        }
        if (response?.status >= 400) {
          countRejection(response.status);
          throw new Error();
        }
      }),
  );
  console.log(`${CONCURRENT_USERS} requests made with ${type} approach:`);
  console.log({
    success: requests.filter((r) => r.status === "fulfilled").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
    rejections,
  });
})();

const rejections: Record<string | number, number> = {};
function countRejection(key: number | string) {
  if (rejections[key] !== undefined) {
    rejections[key]++;
  } else {
    rejections[key] = 0;
  }
}
