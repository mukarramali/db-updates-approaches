import { prisma, slug } from "../src/shared";

(async function () {
  await prisma.products.update({
    where: {
      slug,
    },
    data: {
      stock: 10000,
    },
  });
})();
