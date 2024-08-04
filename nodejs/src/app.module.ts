import { Module } from "@nestjs/common";
import { OrdersController } from "./orders/orders.controller";
import { OrdersRepository } from "./orders/orders.repository";
import { OrdersService } from "./orders/orders.service";

@Module({
  imports: [],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
})
export class AppModule {}
