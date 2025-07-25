import { db } from "@/drizzle/db";
import {
  CourseProductTable,
  ProductTable,
  PurchasesTable,
} from "@/drizzle/schema";
import { and, eq, isNull } from "drizzle-orm";
import { revalidateProductCache } from "./cache";
import { getPurchaseGlobalTag } from "@/features/purchases/db/cache";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

export async function getUserOwnsProduct({
  userId,
  productId,
}: {
  userId: string;
  productId: string;
}) {
  "use cache";
  cacheTag(getPurchaseGlobalTag());

  const existingPurchase = await db.query.CourseProductTable.findFirst({
    where: and(
      eq(PurchasesTable.productId, productId),
      eq(PurchasesTable.userId, userId),
      isNull(PurchasesTable.refundedAt)
    ),
  });

  return existingPurchase != null;
}

export async function insertProduct(
  data: typeof ProductTable.$inferInsert & { courseIds: string[] }
) {
  const newProduct = await db.transaction(async (trx) => {
    const [newProduct] = await trx
      .insert(ProductTable)
      .values(data)
      .returning();
    if (newProduct == null) {
      trx.rollback();
      throw new Error("Failed to create product");
    }
    await trx
      .insert(CourseProductTable)
      .values(
        data.courseIds.map((id) => ({ productId: newProduct.id, courseId: id }))
      );
    return newProduct;
  });

  revalidateProductCache(newProduct.id);
  return newProduct;
}

export async function updateProduct(
  id: string,
  data: typeof ProductTable.$inferInsert & { courseIds: string[] }
) {
  const updatedProduct = await db.transaction(async (trx) => {
    const [updatedProduct] = await trx
      .update(ProductTable)
      .set(data)
      .where(eq(ProductTable.id, id))
      .returning();
    if (updatedProduct == null) {
      trx.rollback();
      throw new Error("Failed to update product");
    }
    await trx
      .delete(CourseProductTable)
      .where(eq(CourseProductTable.productId, id));
    await trx
      .insert(CourseProductTable)
      .values(
        data.courseIds.map((id) => ({
          productId: updatedProduct.id,
          courseId: id,
        }))
      );
    return updatedProduct;
  });

  revalidateProductCache(updatedProduct.id);

  return updatedProduct;
}

export async function deleteProduct(id: string) {
  const [deletedProduct] = await db
    .delete(ProductTable)
    .where(eq(ProductTable.id, id))
    .returning();
  if (deletedProduct == null) throw new Error("Failed to delete product");
  revalidateProductCache(deletedProduct.id);

  return deletedProduct;
}
