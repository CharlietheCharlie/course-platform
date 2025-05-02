import { userRole } from "@/drizzle/schema";

export function canCreateCourseSections(user: { role: userRole | undefined }) {
  return user.role === "admin";
}

export function canUpdateCourseSections(user: { role: userRole | undefined }) {
  return user.role === "admin";
}

export function canDeleteCourseSections(user: { role: userRole | undefined }) {
  return user.role === "admin";
}