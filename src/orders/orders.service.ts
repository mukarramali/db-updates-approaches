import { Injectable } from "@nestjs/common";
import { prisma, slug } from "../shared";

@Injectable()
export class OrdersService {
  async createOrder() {
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
        quantity: product.quantity + 2,
      },
    });
  }
}
