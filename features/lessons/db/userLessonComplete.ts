import { db } from "@/drizzle/db";
import { UserLessonCompleteTable } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { revalidateUserLessonCompleteCache } from "./cache/userLessonComplete";

export async function updateUserLessonCompleteStatus({
  userId,
  lessonId,
  complete,
}: {
  userId: string;
  lessonId: string;
  complete: boolean;
}) {
    let completion:{lessonId: string; userId: string}| undefined;
  if (complete) {
    const [c] = await db.insert(UserLessonCompleteTable)
      .values({ userId, lessonId })
      .onConflictDoNothing()
      .returning();
    
    completion = c;
  } else {
    const [c] = await db.delete(UserLessonCompleteTable)
      .where(
        and(
          eq(UserLessonCompleteTable.userId, userId),
          eq(UserLessonCompleteTable.lessonId, lessonId)
        )
      )
      .returning();
    
    completion = c;
  }

  if (completion == null) return;
  revalidateUserLessonCompleteCache({
    id: completion.userId,
    lessonId: completion.lessonId,
  });
}
