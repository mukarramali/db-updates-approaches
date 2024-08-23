export const slug = "bike";

export type methods =
  | "selectAndUpdate"
  | "selectAndUpdateInTransaction"
  | "decrement"
  | "optimistic"
  | "optimisticRetries"
  | "updateWithLocking"
  | "failureStepsWithoutTransaction"
  | "failureStepsWithTransaction"
  | "updateInJob";
