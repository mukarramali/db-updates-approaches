import { Controller, Post } from "@nestjs/common";
import { OrdersService } from "./orders.service";

@Controller("orders")
export class OrdersController {
  constructor(private readonly appService: OrdersService) {}

  @Post()
  order(): string {
    return this.appService.createOrder();
  }
}
