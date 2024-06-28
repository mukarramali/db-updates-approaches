import { prisma, slug } from "../src/shared";

(async function () {
  await prisma.orders.deleteMany({
    where: {
      id: {
        not: "0434eb0a-e956-4f8d-95c6-fe9a6362836a",
      },
    },
  });
  await prisma.products.update({
    where: {
      slug,
    },
    data: {
      stock: 10000,
    },
  });
})();
