import { Controller, Post, Query } from "@nestjs/common";
import { OrdersService } from "./orders.service";

@Controller("orders")
export class OrdersController {
  constructor(private readonly appService: OrdersService) {}

  @Post()
  order(@Query("type") type: string) {
    return this.appService.createOrder(type || "select-update");
  }
}
