import { Injectable } from "@nestjs/common";
import { methods } from "../shared";
import { OrdersRepository } from "./orders.repository";

@Injectable()
export class OrdersService {
  constructor(private readonly repo: OrdersRepository) {}

  async createOrder(type: methods) {
    switch (type) {
      case "select-update":
        return this.repo.selectAndUpdate();
      case "increment":
        return this.repo.increment();
    }
  }
}
