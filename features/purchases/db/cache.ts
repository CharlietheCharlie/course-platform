import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export function getPurchaseGlobalTag() {
  return getGlobalTag("purchases");
}

export function getPurchaseIdTag(id: string) {
  return getIdTag("purchases", id);
}

export function getPruchaseUserTag(userId: string) {
  return getIdTag("purchases", userId);
}

export function revalidatePurchaseCache(id: string, userId: string) {
  revalidateTag(getPurchaseGlobalTag());
  revalidateTag(getPurchaseIdTag(id));
  revalidateTag(getPruchaseUserTag(userId));
}
