import { methods } from "../src/shared";

const CONCURRENT_USERS = 1000;
const CONCURRENCY_LATENCY = 1;
const type: methods = "increment";

(async function () {
  const API = `http://localhost:3000/orders?type=${type}`;
  await Promise.allSettled(
    Array(CONCURRENT_USERS)
      .fill(undefined)
      .map(async () => {
        await wait();
        return fetch(API, {
          method: "POST",
        });
      }),
  );
})();

async function wait() {
  return new Promise((resolve, rejects) => {
    setTimeout(() => {
      resolve("");
    }, Math.floor(Math.random() * CONCURRENCY_LATENCY));
  });
}
