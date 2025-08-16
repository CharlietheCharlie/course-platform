import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { db } from "@/drizzle/db";
import { PurchasesTable } from "@/drizzle/schema";
import { UserPurchaseTable, UserPurchaseTableSkeleton } from "@/features/purchases/components/UserPurchaseTable";
import { getPurchaseUserTag } from "@/features/purchases/db/cache";
import { getCurrentUser } from "@/services/clerk";
import { desc, eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import Link from "next/link";
import { Suspense } from "react";

export default function PurchasesPage() {
  return (
    <div className="container my-6">
      <PageHeader title="Purchase History"></PageHeader>
      <Suspense fallback={<UserPurchaseTableSkeleton />}>
        <SuspenseBoundary />
      </Suspense>
    </div>
  );
}

async function SuspenseBoundary() {
  const { userId, redirectToSignIn } = await getCurrentUser();
  if (!userId) return redirectToSignIn();
  const purchases = await getPurchase(userId);
  if( purchases.length === 0) {
    return <div className="flex flex-col gap-2 items-start">
        You have not made any purchases yet.
        <Button asChild size="lg">
            <Link href="/">Browse Courses</Link>
        </Button>
    </div>;
  }

  return <UserPurchaseTable purchases={purchases} />;
}

async function getPurchase(userId: string) {
  "use cache";
  cacheTag(getPurchaseUserTag(userId));
  return db.query.PurchasesTable.findMany({
    columns: {
      id: true,
      pricePaidInCents: true,
      refundedAt: true,
      productDetails: true,
      createdAt: true,
    },
    where: eq(PurchasesTable.userId, userId),
    orderBy: desc(PurchasesTable.createdAt),
  });
}
