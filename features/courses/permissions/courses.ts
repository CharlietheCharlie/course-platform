import { userRole } from "@/drizzle/schema";

export function canCreateCourses(user: { role: userRole | undefined }) {
  return user.role === "admin";
}

export function canDeleteCourses(user: { role: userRole | undefined }) {
  return user.role === "admin";
}