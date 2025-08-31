import { PageHeader } from "@/components/PageHeader";
import { db } from "@/drizzle/db";
import { PurchasesTable as DbPurchasesTable } from "@/drizzle/schema";
import { PurchaseTable } from "@/features/purchases/components/PurchaseTable";
import { getPurchaseGlobalTag } from "@/features/purchases/db/cache";
import { getUserGlobalTag } from "@/features/users/db/cache";
import { desc } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

export default async function PurchasePage() {
  const purchases = await getPurchases();

  return (
    <div className="container my-6">
        <PageHeader  title="Sales"></PageHeader>
        <PurchaseTable purchases={purchases}></PurchaseTable>
    </div>
  )
}

async function getPurchases() {
  "use cache";

  cacheTag(getPurchaseGlobalTag(), getUserGlobalTag());

  return db.query.PurchasesTable.findMany({
    columns: {
      id: true,
      productDetails: true,
      pricePaidInCents: true,
      createdAt: true,
      refundedAt: true,
    },
    orderBy: desc(DbPurchasesTable.createdAt),
    with: {
      user: {
        columns: {
          name: true,
        },
      },
    },
  });
}
