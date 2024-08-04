import { Controller, Post, Query } from "@nestjs/common";
import { methods } from "../shared";
import { OrdersService } from "./orders.service";

@Controller("orders")
export class OrdersController {
  private errorTypes = new Set();
  constructor(private readonly appService: OrdersService) {}

  @Post()
  async order(@Query("type") type: methods) {
    try {
      await this.appService.createOrder(type || "selectAndUpdate");
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
