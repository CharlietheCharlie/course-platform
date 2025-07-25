import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import Link from "next/link";

import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { db } from "@/drizzle/db";
import {
  CourseProductTable,
  ProductTable as DbProductTable,
  PurchasesTable,
} from "@/drizzle/schema";

import { asc, countDistinct, desc, eq } from "drizzle-orm";
import { getProductGlobalTag } from "@/features/products/db/cache";
import { custom } from "zod";
import { ProductTable } from "@/features/products/components/ProductTable";

export default async function ProductsPages() {
  const products = await getProducts();
  return (
    <div className="container my-6">
      <PageHeader title="Products">
        <Button asChild>
          <Link href="/admin/products/new">New Product</Link>
        </Button>
      </PageHeader>

      <ProductTable products={products} />
    </div>
  );
}

async function getProducts() {
  "use cache";
  cacheTag(getProductGlobalTag());
  return db
    .select({
      id: DbProductTable.id,
      name: DbProductTable.name,
      status: DbProductTable.status,
      priceInDollars: DbProductTable.priceInDollars,
      description: DbProductTable.description,
      imageUrl: DbProductTable.imageUrl,
      coursesCount: countDistinct(CourseProductTable.courseId),
      customersCount: countDistinct(PurchasesTable.userId),
    })
    .from(DbProductTable)
    .leftJoin(PurchasesTable, eq(PurchasesTable.productId, DbProductTable.id))
    .leftJoin(
      CourseProductTable,
      eq(CourseProductTable.productId, DbProductTable.id)
    )
    .orderBy(asc(DbProductTable.name))
    .groupBy(DbProductTable.id);
}
