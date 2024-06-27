import { methods } from "../src/shared";

const CONCURRENT_USERS = 100;
const type: methods = "decrement";

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
    }, Math.floor(Math.random() * 1000));
  });
}
