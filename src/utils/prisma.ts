import { PrismaClient } from "@prisma/client";
import { backOff, IBackOffOptions } from "exponential-backoff";
import { Prisma } from "@prisma/client";

function RetryTransactions(opts?: Partial<IBackOffOptions>) {
  return Prisma.defineExtension((client) =>
    client.$extends({
      client: {
        $transaction(args: any) {
          return backOff(() => client.$transaction.apply(client, args), {
            retry: (err: any) => err.code === "P2034",
            ...opts,
          });
        },
      },
    })
  );
}

export const prisma = new PrismaClient().$extends(
  RetryTransactions({ numOfAttempts: 5 })
);
