import { env } from "@/data/env/serve";
import { db } from "@/drizzle/db";
import { ProductTable, UserTable } from "@/drizzle/schema";
import { addUserCourseAccess } from "@/features/courses/db/userCourseAccess";
import { insertPurchase } from "@/features/purchases/purchases";
import { stripeServerClient } from "@/services/stripe/stripeServer";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET(request: NextRequest) {
  const stripeSessionId = request.nextUrl.searchParams.get("stripeSessionId");
  if (!stripeSessionId) redirect("/product/purchase-failure");

  let redirectUrl: string;
  try {
    const checkoutSession = await stripeServerClient.checkout.sessions.retrieve(
      stripeSessionId,
      {
        expand: ["line_items"],
      }
    );
    const productId = await processStripeCheckout(checkoutSession);
    redirectUrl = `/products/${productId}/purchase/success`;
  } catch (error) {
    console.error("Error retrieving checkout session:", error);
    redirectUrl = "/products/purchase-failure";
  }

  return NextResponse.redirect(new URL(redirectUrl, request.url));
}

export async function POST(request: NextRequest) {
  const event = await stripeServerClient.webhooks.constructEvent(
    await request.text(),
    request.headers.get("stripe-signature") as string,
    env.STRIPE_WEBHOOK_SECRET
  );

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      try {
        await processStripeCheckout(event.data.object);
      } catch (error) {
        return new Response(null, { status: 500 });
      }
    }
  }

  return new Response(null, { status: 200 });
}

async function processStripeCheckout(checkoutSession: Stripe.Checkout.Session) {
  const userId = checkoutSession.metadata?.userId;
  const productId = checkoutSession.metadata?.productId;
  if (!productId || !userId) {
    throw new Error("Missing productId or userId in checkout session metadata");
  }

  const [product, user] = await Promise.all([
    getProduct(productId),
    getUser(userId),
  ]);

  if (!product) throw new Error("Product not found");
  if (!user) throw new Error("User not found");

  const courseIds = product.courseProducts?.map((cp) => cp.courseId) || [];
  db.transaction(async (trx) => {
    try {
      await addUserCourseAccess(
        {
          userId: user.id,
          courseIds,
        },
        trx
      );
      await insertPurchase(
        {
          stripeSessionId: checkoutSession.id,
          pricePaidInCents:
            checkoutSession.amount_total || product.priceInDollars * 100,
          productDetails: product,
          userId: user.id,
          productId,
        },
        trx
      );
    } catch (error) {
      trx.rollback();
      throw new Error("Transaction failed");
    }
  });
  return product.id;
}

async function getProduct(productId: string) {
  return db.query.ProductTable.findFirst({
    columns: {
      id: true,
      name: true,
      priceInDollars: true,
      description: true,
      imageUrl: true,
    },
    where: eq(ProductTable.id, productId),
    with: {
      courseProducts: { columns: { courseId: true } },
    },
  });
}

async function getUser(userId: string) {
  return db.query.UserTable.findFirst({
    columns: {
      id: true,
    },
    where: eq(UserTable.id, userId),
  });
}
