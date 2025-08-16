import { db } from "@/drizzle/db";
import { PurchasesTable } from "@/drizzle/schema";
import { revalidatePurchaseCache } from "./cache";

export async function insertPurchase(data: typeof PurchasesTable.$inferInsert, trx: Omit<typeof db, "$client"> = db) {
  const details = data.productDetails;

  const [newPurchase] = await trx.insert(PurchasesTable).values({
    ...data,
    productDetails:{
      name: details.name,
      description: details.description,
      imageUrl: details.imageUrl
    }
  }).onConflictDoNothing().returning();

 

  return newPurchase;
}