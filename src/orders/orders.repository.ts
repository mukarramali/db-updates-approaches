import { Injectable } from "@nestjs/common";
import { prisma, slug } from "../shared";
import { sleep } from "../shared/utils";

@Injectable()
export class OrdersRepository {
  async selectAndUpdate() {
    const product = await prisma.products.findUnique({
      where: {
        slug,
      },
      select: {
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

  /**
   * Non blocking, concurrency can compromise
   */
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

  /**
   * Pro: Non blocking, high concurrency, handle conflict gracefully
   * Con: Conflict handling makes it complex
   * Remark: Should only be used in low concurrent writes
   * Example: Collaborating on google docs
   */
  async optimistic() {
    const product = await prisma.products.findUnique({
      where: {
        slug,
      },
      select: {
        sold: true,
        version: true,
      },
    });
    await prisma.products.update({
      where: {
        slug,
        version: product.version,
      },
      data: {
        sold: {
          increment: 1,
        },
        version: {
          increment: 1,
        },
      },
    });
  }

  /**
   * Non blocking, high concurrency, handle conflict gracefully
   */
  async optimisticRetries() {
    for (let i = 1; i < 5; i++) {
      try {
        const data = await this.optimistic();
        return data;
      } catch (error) {
        const delay = Math.pow(2, i) * 100 + Math.floor(Math.random() * 100);
        await sleep(delay);
      }
    }
  }

  async updateWithLocking() {
    return prisma.$transaction(async (tx) => {
      const product = await tx.$queryRaw`
        SELECT * FROM products
        WHERE slug = ${slug}
        FOR UPDATE
      `;

      return tx.products.update({
        where: {
          slug,
        },
        data: {
          sold: product[0].sold + 1,
        },
      });
    });
  }

  /**
   * Non blocking, high concurrency
   */
  async updateInJob() {
    // sendToQueue({ type: 'incrementSold', slug });
  }
}
