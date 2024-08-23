import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { prisma, slug } from "../shared";
import { failRandomly, sleep } from "../shared/utils";
import { queue } from "./queue";

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

    await this.sendEmail();

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

      await this.sendEmail();

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

      await this.sendEmail();

      await prisma.orders.create({
        data: {},
      });
    });
  }

  async sendEmail() {
    if (failRandomly()) {
      throw new HttpException(
        "Could not send email",
        HttpStatus.GATEWAY_TIMEOUT,
      );
    } else {
      const delay = Math.floor(Math.random() * 300);
      await sleep(delay);
    }
  }
}
