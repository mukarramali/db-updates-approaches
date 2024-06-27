import { Module } from "@nestjs/common";
import { OrdersController } from "./orders/orders.controller";
import { OrdersService } from "./orders/orders.service";

@Module({
  imports: [],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class AppModule {}
