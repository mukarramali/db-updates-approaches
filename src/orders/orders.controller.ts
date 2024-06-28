import { Controller, Post, Query } from "@nestjs/common";
import { methods } from "../shared";
import { OrdersService } from "./orders.service";

@Controller("orders")
export class OrdersController {
  constructor(private readonly appService: OrdersService) {}

  @Post()
  async order(@Query("type") type: methods) {
    return await this.appService.createOrder(type || "selectAndUpdate");
  }
}
