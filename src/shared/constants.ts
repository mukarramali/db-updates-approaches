export const slug = "bike";

export type methods =
  | "selectAndUpdate"
  | "decrement"
  | "optimistic"
  | "optimisticRetries"
  | "updateWithLocking"
  | "failureStepsWithoutTransaction"
  | "failureStepsWithTransaction";
