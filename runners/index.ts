const CONCURRENT_USERS = 100;
const API = "http://localhost:3000/orders";

async function wait() {
  return new Promise((resolve, rejects) => {
    setTimeout(() => {
      resolve("");
    }, Math.floor(Math.random() * 1000));
  });
}

(async function () {
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
