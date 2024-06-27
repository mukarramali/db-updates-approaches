import { Injectable } from "@nestjs/common";
import { prisma, slug } from "../shared";

@Injectable()
export class OrdersRepository {
  async selectAndUpdate() {
    const product = await prisma.products.findFirstOrThrow({
      where: {
        slug,
      },
      select: {
        id: true,
        sold: true,
      },
    });
    return prisma.products.update({
      where: {
        slug,
      },
      data: {
        sold: product.sold + 1,
      },
    });
  }

  async increment() {
    return prisma.products.update({
      where: {
        slug,
      },
      data: {
        sold: {
          increment: 1,
        },
      },
    });
  }

  async updateStockAndOrder() {
    await prisma.products.update({
      where: {
        slug,
      },
      data: {
        sold: {
          decrement: 1,
        },
      },
    });
    await prisma.orders.create({});
  }
}
