import { ProductTable, userRole } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export function canCreateProducts(user: { role: userRole | undefined }) {
  return user.role === "admin";
}

export function canUpdateProducts(user: { role: userRole | undefined }) {
  return user.role === "admin";
}

export function canDeleteProducts(user: { role: userRole | undefined }) {
  return user.role === "admin";
}

export const wherePublicProducts = eq(ProductTable.status, "public" );
