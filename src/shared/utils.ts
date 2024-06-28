import { promisify } from "util";
export const sleep = promisify(setTimeout);

export const failRandomly = (probTrue = 0.2) => Math.random() < probTrue;
