import { db } from "@/drizzle/db";
import {
  CourseSectionTable,
  CourseTable,
  LessonStatus,
  LessonTable,
  UserCourseAccessTable,
  userRole,
} from "@/drizzle/schema";
import { getUserCourseAccessUserTag } from "@/features/courses/db/cache/userCourseAccess";
import { wherePublicCourseSections } from "@/features/courseSections/permissions/sections";
import { and, eq, or } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getLessonIdTag } from "../db/cache/lessons";

export function canCreateLessons(user: { role: userRole | undefined }) {
  return user.role === "admin";
}

export function canUpdateLessons(user: { role: userRole | undefined }) {
  return user.role === "admin";
}

export function canDeleteLessons(user: { role: userRole | undefined }) {
  return user.role === "admin";
}

export async function canViewLesson(
  { role, userId }: { role: userRole | undefined; userId: string | undefined },
  lesson: { id: string; status: LessonStatus }
) {
  "use cache";
  if (role === "admin" || lesson.status === "preview") return true;
  if (userId == null || lesson.status === "private") return false;

  cacheTag(getUserCourseAccessUserTag(userId),getLessonIdTag(lesson.id));

  const [data] = await db
    .select({ courseId: CourseTable.id })
    .from(UserCourseAccessTable)
    .leftJoin(CourseTable, eq(UserCourseAccessTable.courseId, CourseTable.id))
    .leftJoin(
      CourseSectionTable,
      and(
        eq(CourseTable.id, CourseSectionTable.courseId),
        wherePublicCourseSections
      )
    )
    .leftJoin(
      LessonTable,
      and(eq(CourseSectionTable.id, LessonTable.sectionId), wherePublicLessons)
    )
    .where(
      and(
        eq(UserCourseAccessTable.userId, userId),
        eq(LessonTable.id, lesson.id)
      )
    )
    .limit(1);

  return data != null && data.courseId != null;
}

export const wherePublicLessons = or(
  eq(LessonTable.status, "preview"),
  eq(LessonTable.status, "public")
);
