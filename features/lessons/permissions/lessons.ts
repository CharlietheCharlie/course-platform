import { LessonTable, userRole } from "@/drizzle/schema";
import { eq, or } from "drizzle-orm";

export function canCreateLessons(user: { role: userRole | undefined }) {
  return user.role === "admin";
}

export function canUpdateLessons(user: { role: userRole | undefined }) {
  return user.role === "admin";
}

export function canDeleteLessons(user: { role: userRole | undefined }) {
  return user.role === "admin";
}

export const wherePublicLessons = or(eq(LessonTable.status, "preview"), eq(LessonTable.status, "public" ));