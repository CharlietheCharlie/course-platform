import { db } from "@/drizzle/db";
import {
  ProductTable,
  PurchasesTable,
  UserCourseAccessTable,
} from "@/drizzle/schema";
import { revalidateTag } from "next/cache";
import { revalidateUserCourseAccessCache } from "./cache/userCourseAccess";
import { and, eq, inArray, isNull } from "drizzle-orm";

export async function addUserCourseAccess(
  {
    userId,
    courseIds,
  }: {
    userId: string;
    courseIds: string[];
  },
  trx: Omit<typeof db, "$client"> = db
) {
  const accesses = await trx
    .insert(UserCourseAccessTable)
    .values(
      courseIds.map((courseId) => ({
        userId,
        courseId,
      }))
    )
    .onConflictDoNothing()
    .returning();

  accesses.forEach(revalidateUserCourseAccessCache);
  return accesses;
}

export async function revokeUserCourseAccess(
  {
    userId,
    productId,
  }: {
    userId: string;
    productId: string;
  },
  trx: Omit<typeof db, "$client"> = db
) {
  const validPurchases = await trx.query.PurchasesTable.findMany({
    where: and(
      eq(PurchasesTable.userId, userId),
      isNull(PurchasesTable.refundedAt)
    ),
    with: {
      product: {
        with: {
          courseProducts: { columns: { courseId: true } },
        },
      },
    },
  });

  const refundPurchase = await trx.query.ProductTable.findFirst({
    where: eq(ProductTable.id, productId),
    with: {
      courseProducts: { columns: { courseId: true } },
    },
  });

  if (!refundPurchase) return;

  const validCourseIds = validPurchases.flatMap((purchase) =>
    purchase.product?.courseProducts?.map((cp) => cp.courseId) || []
  );
  const removeCourseIds = refundPurchase.courseProducts
    ?.map((cp) => cp.courseId)
    .filter((courseId) => !validCourseIds.includes(courseId));

  const revokeAccesses = await trx.delete(UserCourseAccessTable).
    where(
      and(
        eq(UserCourseAccessTable.userId, userId),
        inArray(UserCourseAccessTable.courseId, removeCourseIds || [])
      )
    ).
    returning();

    revokeAccesses.forEach(revalidateUserCourseAccessCache);
    return revokeAccesses;
}
