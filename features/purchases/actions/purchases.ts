"use server";

import { getCurrentUser } from "@/services/clerk";
import { canRefundPurchase } from "../permissions/products";
import { stripeServerClient } from "@/services/stripe/stripeServer";
import { db } from "@/drizzle/db";
import { updatePurchase } from "../db/purchases";
import { revokeUserCourseAccess } from "@/features/courses/db/userCourseAccess";

export async function refundPurchase(purchaseId: string) {
  if (!canRefundPurchase(await getCurrentUser())) {
    return { error: true, message: "There was an error refunding purchases." };
  }
  const data = await db.transaction(async (tx) => {
    const refundedPurchase = await updatePurchase(
      purchaseId,
      { refundedAt: new Date() },
      tx
    );
    const session = await stripeServerClient.checkout.sessions.retrieve(
      refundedPurchase.stripeSessionId
    );
    if (session.payment_intent == null) {
      tx.rollback();
      return {
        error: true,
        message: "There was an error refunding purchases.",
      };
    }
    try{
        await stripeServerClient.refunds.create({
          payment_intent: typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent.id,
        });
        await revokeUserCourseAccess(refundedPurchase, tx);
    } catch(error) {
        tx.rollback();
        return {
          error: true,
          message: "There was an error refunding purchases.",
        };
    }
  });

  return data ?? { error: false, message: "Purchase refunded successfully." };
}
