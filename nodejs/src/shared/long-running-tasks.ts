import { HttpException, HttpStatus } from "@nestjs/common";
import { failRandomly, sleep } from "./utils";

export const sendEmail = async () => {
  if (failRandomly()) {
    throw new HttpException("Could not send email", HttpStatus.GATEWAY_TIMEOUT);
  } else {
    const delay = Math.floor(Math.random() * 300);
    await sleep(delay);
  }
};
