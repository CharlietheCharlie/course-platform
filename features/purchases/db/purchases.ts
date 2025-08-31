import { db } from "@/drizzle/db";
import { PurchasesTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { revalidatePurchaseCache } from "./cache";

export async function insertPurchase(
  data: typeof PurchasesTable.$inferInsert,
  trx: Omit<typeof db, "$client"> = db
) {
  const details = data.productDetails;

  const [newPurchase] = await trx
    .insert(PurchasesTable)
    .values({
      ...data,
      productDetails: {
        name: details.name,
        description: details.description,
        imageUrl: details.imageUrl,
      },
    })
    .onConflictDoNothing()
    .returning();

  return newPurchase;
}

export async function updatePurchase(
  id: string,
  data: Partial<typeof PurchasesTable.$inferInsert>,
  trx: Omit<typeof db, "$client"> = db
) {
  const details = data.productDetails;

  const [updatedPurchase] = await trx
    .update(PurchasesTable)
    .set({
      ...data,
      productDetails: details
        ? {
            name: details.name,
            description: details.description,
            imageUrl: details.imageUrl,
          }
        : undefined,
    })
    .where(eq(PurchasesTable.id, id))
    .returning();

  if(updatedPurchase == null)throw new Error("Failed to update purchase");

  revalidatePurchaseCache(updatedPurchase);

  return updatedPurchase;
}
