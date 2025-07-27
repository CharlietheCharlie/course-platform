import { db } from "@/drizzle/db";
import { userRole, UserTable } from "@/drizzle/schema";
import { getUserIdTag } from "@/features/users/db/cache";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

const client = await clerkClient();

export async function getCurrentUser({ allData = false } = {}) {
  const { userId, sessionClaims, redirectToSignIn } = await auth();
  if (sessionClaims?.dbId) {
    console.log(await getUser(sessionClaims?.dbId));
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
