import { Transaction } from "@prisma/client";

export interface ApiTransaction {
  status: "success" | "failure";
  response: Transaction[];
}
