import { userRole } from "@/drizzle/schema";

export async function canRefundPurchase({
  role,
}: {
  role: userRole | undefined;
}) {
 return role === "admin";
}
