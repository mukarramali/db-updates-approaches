import { Controller, Post, Query } from "@nestjs/common";
import { methods } from "../shared";
import { OrdersService } from "./orders.service";

@Controller("orders")
export class OrdersController {
  constructor(private readonly appService: OrdersService) {}

  @Post()
  order(@Query("type") type: methods) {
    return this.appService.createOrder(type || "selectAndUpdate");
  }
}
