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
        quantity: true,
      },
    });
    return prisma.products.update({
      where: {
        slug,
      },
      data: {
        quantity: product.quantity - 1,
      },
    });
  }

  async decrement() {
    return prisma.products.update({
      where: {
        slug,
      },
      data: {
        quantity: {
          decrement: 1,
        },
      },
    });
  }
}
