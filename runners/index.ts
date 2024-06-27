import { methods } from "../src/shared";

const CONCURRENT_USERS = 1000;
const CONCURRENCY_MAX_LATENCY = 100;
const type: methods = "optimistic";

(async function () {
  const API = `http://localhost:3000/orders?type=${type}`;
  const requests = await Promise.allSettled(
    Array(CONCURRENT_USERS)
      .fill(undefined)
      .map(async () => {
        await wait();
        return fetch(API, {
          method: "POST",
        });
      }),
  );
  console.log(`${CONCURRENT_USERS} requests made with ${type} approach:`);
  console.log({
    success: requests.filter((r) => r.status === "fulfilled").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  });
})();

async function wait() {
  return new Promise((resolve, rejects) => {
    setTimeout(() => {
      resolve("");
    }, Math.floor(Math.random() * CONCURRENCY_MAX_LATENCY));
  });
}
