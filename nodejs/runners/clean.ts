import { randomUUID } from "crypto";
import { prisma, slug } from "../src/shared";

(async function () {
  await prisma.orders.deleteMany({
    where: {
      id: {
        not: randomUUID(),
      },
    },
  });
  await prisma.products.upsert({
    where: {
      slug,
    },
    create: {
      slug,
      stock: 10000,
      version: 0,
    },
    update: {
      stock: 10000,
      version: 0,
    },
  });
})();
