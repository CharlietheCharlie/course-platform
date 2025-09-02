import { db } from "@/drizzle/db";
import {
  CourseSectionTable,
  CourseTable,
  LessonTable,
  UserCourseAccessTable,
} from "@/drizzle/schema";
import { wherePublicCourseSections } from "@/features/courseSections/permissions/sections";
import { and, eq } from "drizzle-orm";
import { wherePublicLessons } from "./lessons";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import {getUserCourseAccessUserTag } from "@/features/courses/db/cache/userCourseAccess";
import { getLessonIdTag } from "../db/cache/lessons";

export async function canUpdateUserLessonCompleteStatus(
  user: { userId: string | undefined },
  lessonId: string
) {
  "use cache";
  cacheTag(
      getLessonIdTag(lessonId),
  )
  if (user.userId == null) return false;

  cacheTag(
    getUserCourseAccessUserTag(user.userId),
  );

  const [courseAccess] = await db
    .select({ courseId: CourseTable.id })
    .from(UserCourseAccessTable)
    .innerJoin(CourseTable, eq(UserCourseAccessTable.courseId, CourseTable.id))
    .innerJoin(
      CourseSectionTable,
      and(
        eq(CourseTable.id, CourseSectionTable.courseId),
        wherePublicCourseSections
      )
    )
    .innerJoin(
      LessonTable,
      and(eq(CourseSectionTable.id, LessonTable.sectionId), wherePublicLessons)
    )
    .where(
      and(
        eq(LessonTable.id, lessonId),
        eq(UserCourseAccessTable.userId, user.userId)
      )
    )
    .limit(1);

  return courseAccess != null;
}
