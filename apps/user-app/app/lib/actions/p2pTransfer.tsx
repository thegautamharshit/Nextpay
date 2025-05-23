"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { prisma } from "@repo/db";

export async function p2pTransfer(to: string, amount: number) {
  const session = await getServerSession(authOptions);
  const from = session?.user?.id;
  if (!from) {
    return {
      message: "Error while sending"
    }
  }
  
  const toUser = await prisma.user.findFirst({
    where: {
      number: to
    }
  });

  if (!toUser) {
    return {
      message: "User not found"
    }
  }
  
  try {
    await prisma.$transaction(async (tx) => {
      // Lock the sender's balance row to prevent concurrent modifications.
      await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(from)} FOR UPDATE`;

      // Read the sender's balance within the locked scope.
      const fromBalance = await tx.balance.findUnique({
        where: { userId: Number(from) },
      });

      // Verify there are enough funds.
      if (!fromBalance || fromBalance.amount < amount) {
        throw new Error('Insufficient funds');
      }
      
      // Update the sender's balance.
      await tx.balance.update({
        where: { userId: Number(from) },
        data: { amount: { decrement: amount } },
      });

      // Update the recipient's balance.
      await tx.balance.update({
        where: { userId: toUser.id },
        data: { amount: { increment: amount } },
      });

      await tx.p2pTransfer.create({
        data: {
          amount,
          timestamp: new Date(),
          fromUserId: Number(from),
          toUserId: toUser.id
        }
      });
    });
    
    return { message: "Transfer successful" };
  } catch (error : any) {
    return { message: error.message || "Transfer failed" };
  }
}
