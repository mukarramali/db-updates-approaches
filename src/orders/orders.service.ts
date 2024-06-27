import { Injectable } from "@nestjs/common";

@Injectable()
export class OrdersService {
  createOrder(): string {
    return "Hello World!";
  }
}
