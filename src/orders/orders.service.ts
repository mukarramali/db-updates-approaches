import { Injectable } from "@nestjs/common";
import { methods } from "../shared";
import { OrdersRepository } from "./orders.repository";

@Injectable()
export class OrdersService {
  constructor(private readonly repo: OrdersRepository) {}

  async createOrder(type: methods) {
    switch (type) {
      case "selectAndUpdate":
        return this.repo.selectAndUpdate();
      case "decrement":
        return this.repo.decrement();
      case "optimistic":
        return this.repo.optimistic();
      case "optimisticRetries":
        return this.repo.optimisticRetries();
      case "updateWithLocking":
        return this.repo.updateWithLocking();
      case "failureStepsWithoutTransaction":
        return this.repo.failureStepsWithoutTransaction();
      case "failureStepsWithTransaction":
        return this.repo.failureStepsWithTransaction();
    }
  }
}
