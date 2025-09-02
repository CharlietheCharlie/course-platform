"use server";

import { getCurrentUser } from "@/services/clerk";
import { canUpdateUserLessonCompleteStatus } from "../permissions/userLessonComplete";
import { updateUserLessonCompleteStatus as updateUserLessonCompleteStatusDb } from "../db/userLessonComplete";

export async function updateLessonCompleteStatus(
  lessonId: string,
  complete: boolean
) {
  const { userId } = await getCurrentUser();
  const permission = await canUpdateUserLessonCompleteStatus(
    { userId },
    lessonId
  );

  if (userId == null || !permission) {
    return { error: true, message: "Error updating lesson complete status" };
  }

  await updateUserLessonCompleteStatusDb({ userId, lessonId, complete });

  return {
    error: false,
    message: "Lesson complete status updated successfully",
  };
}
