import { Injectable } from "@nestjs/common";
import { OrdersRepository } from "./orders.repository";

@Injectable()
export class OrdersService {
  constructor(private readonly repo: OrdersRepository) {}

  async createOrder(type: string) {
    switch (type) {
      case "select-update":
        return this.repo.selectAndUpdate();
    }
  }
}
