"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/services/clerk";
import { canCreateProducts, canDeleteProducts, canUpdateProducts } from "../permissions/products";
import { insertProduct,
    updateProduct as updateProductDb,
    deleteProduct as deleteProductDb
 } from "../db/products";
import { productSchema } from "../schemas/products";



export async function createProduct(unsafeData: z.infer<typeof productSchema>) {
  const { success, data } = productSchema.safeParse(unsafeData);

  if (!success || !canCreateProducts(await getCurrentUser())) {
    return { error: true, message: "There was an error creating your product" };
  }

  const product = await insertProduct(data);

  redirect(`/admin/products`);
}

export async function updateProduct(
  id: string,
  unsafeData: z.infer<typeof productSchema>
) {
  const { success, data } = productSchema.safeParse(unsafeData);

  if (!success || !canUpdateProducts(await getCurrentUser())) {
    return { error: true, message: "There was an error updating your product" };
  }

  await updateProductDb(id, data);

  return { error: false, message: "Product updated successfully" };
}

export async function deleteProduct(id: string) {
  if (!canDeleteProducts(await getCurrentUser())) {
    return { error: true, message: "Error deleting your product" };
  }

  await deleteProductDb(id);

  return { error: false, message: "Product deleted successfully" };
}

