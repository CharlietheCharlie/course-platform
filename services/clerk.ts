import { db } from "@/drizzle/db";
import { userRole, UserTable } from "@/drizzle/schema";
import { getUserIdTag } from "@/features/users/db/cache";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { redirect } from "next/navigation";

const client = await clerkClient();

export async function getCurrentUser({ allData = false } = {}) {
  const { userId, sessionClaims, redirectToSignIn } = await auth();

  if (userId && sessionClaims?.dbId == null) {
    // 如果有 userId 但沒有 dbId，則需要同步 Clerk 的使用者資料到資料庫
    redirect("/api/clerk/syncUsers");
  }

  return {
    clerkUserId: userId,
    userId: sessionClaims?.dbId,
    role: sessionClaims?.role,
    user:
      allData && sessionClaims?.dbId != null
        ? await getUser(sessionClaims?.dbId)
        : undefined,
    redirectToSignIn,
  };
}
// 將需要的資訊同步到 Clerk
export async function syncClerkUserMetadata(user: {
  id: string;
  clerkUserId: string;
  role: userRole;
}) {
  return client.users.updateUserMetadata(user.clerkUserId, {
    publicMetadata: {
      dbId: user.id,
      role: user.role,
    },
  });
}

async function getUser(id: string) {
  "use cache";
  cacheTag(getUserIdTag(id));
  return db.query.UserTable.findFirst({
    where: eq(UserTable.id, id),
  });
}
