import { CourseSectionTable, userRole } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export function canCreateCourseSections(user: { role: userRole | undefined }) {
  return user.role === "admin";
}

export function canUpdateCourseSections(user: { role: userRole | undefined }) {
  return user.role === "admin";
}

export function canDeleteCourseSections(user: { role: userRole | undefined }) {
  return user.role === "admin";
}

export const wherePublicCourseSections = eq(CourseSectionTable.status, "public" );