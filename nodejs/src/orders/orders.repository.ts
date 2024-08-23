import { Injectable } from "@nestjs/common";
import { prisma, slug } from "../shared";
import { sendEmail } from "../shared/long-running-tasks";
import { queue } from "../shared/queue";
import { sleep } from "../shared/utils";

@Injectable()
export class OrdersRepository {
  async selectAndUpdate() {
    const product = await prisma.products.findUnique({
      where: {
        slug,
      },
      select: {
        stock: true,
      },
    });
    return prisma.products.update({
      where: {
        slug,
      },
      data: {
        stock: product.stock - 1,
      },
    });
  }

  /**
   * Non blocking, concurrency can compromise
   */
  async decrement() {
    return prisma.products.update({
      where: {
        slug,
      },
      data: {
        stock: {
          decrement: 1,
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
        stock: true,
        version: true,
      },
    });
    await prisma.products.update({
      where: {
        slug,
        version: product.version,
      },
      data: {
        stock: {
          decrement: 1,
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
          stock: product[0].stock - 1,
        },
      });
    });
  }

  async failureStepsWithoutTransaction() {
    await prisma.products.update({
      where: {
        slug,
      },
      data: {
        stock: {
          decrement: 1,
        },
      },
    });

    await sendEmail();

    await prisma.orders.create({
      data: {},
    });
  }

  async failureStepsWithTransaction() {
    await prisma.$transaction(async (tx) => {
      await tx.products.update({
        where: {
          slug,
        },
        data: {
          stock: {
            decrement: 1,
          },
        },
      });

      await sendEmail();

      await tx.orders.create({
        data: {},
      });
    });
  }

  /**
   * Non blocking, high concurrency
   */
  async updateInJob() {
    queue.addTask(async () => {
      await prisma.products.update({
        where: {
          slug,
        },
        data: {
          stock: {
            decrement: 1,
          },
        },
      });

      await sendEmail();

      await prisma.orders.create({
        data: {},
      });
    });
  }
}
