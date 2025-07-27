
import LoadingSpinner from "@/components/LoadingSpinnes";
import { PageHeader } from "@/components/PageHeader";
import { db } from "@/drizzle/db";
import { ProductTable } from "@/drizzle/schema";
import { getProductIdTag } from "@/features/products/db/cache";
import { getUserOwnsProduct } from "@/features/products/db/products";
import { wherePublicProducts } from "@/features/products/permissions/products";
import { getCurrentUser } from "@/services/clerk";
import { StripeCheckoutForm } from "@/services/stripe/components/StripeCheckoutForm";
import { SignIn, SignUp, useUser } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

export default function PurchasePage({
  params,
  searchParams,
}: {
  params: Promise<{ productId: string }>;
  searchParams: Promise<{ authMode?: string }>;
}) {
  return (
    <Suspense fallback={<LoadingSpinner className="mx-auto my-6 size-36" />}>
      <SuspendedComponent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function SuspendedComponent({
  params,
  searchParams,
}: {
  params: Promise<{ productId: string }>;
  searchParams: Promise<{ authMode?: string }>;
}) {
  const { productId } = await params;
  const {user} = await getCurrentUser({ allData: true });
  const product = await getPublicProduct(productId);
  if (product == null) {
    return notFound();
  }
  if (user != null) {
    if (await getUserOwnsProduct({ userId: user.id, productId })) {
      return redirect("/courses");
    }
    return (
      <div className="container my-6">
        <StripeCheckoutForm product={product} user={user}></StripeCheckoutForm>
      </div>
    );
  }
  const { authMode } = await searchParams;
  const isSignUp = authMode === "signUp";
  return (
    <div className="container my-6 flex flex-col items-center">
      <PageHeader title="You need an account to make a purchase"></PageHeader>
      {isSignUp ? (
        <SignUp
          routing="hash"
          signInUrl={`/products/${productId}/purchase?authMode=signIn`}
          forceRedirectUrl={`/products/${productId}/purchase`}
        />
      ) : (
        <SignIn
          routing="hash"
          signUpUrl={`/products/${productId}/purchase?authMode=signUp`}
          forceRedirectUrl={`/products/${productId}/purchase`}
        />
      )}
    </div>
  );
}

async function getPublicProduct(productId: string) {
  "use cache";
  cacheTag(getProductIdTag(productId));

  return db.query.ProductTable.findFirst({
    columns: {
      id: true,
      name: true,
      description: true,
      priceInDollars: true,
      imageUrl: true,
    },
    where: and(eq(ProductTable.id, productId), wherePublicProducts),
  });
}
