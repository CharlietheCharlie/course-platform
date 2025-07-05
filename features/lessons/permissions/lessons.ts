import { userRole } from "@/drizzle/schema";

export function canCreateLessons(user: { role: userRole | undefined }) {
  return user.role === "admin";
}

export function canUpdateLessons(user: { role: userRole | undefined }) {
  return user.role === "admin";
}

export function canDeleteLessons(user: { role: userRole | undefined }) {
  return user.role === "admin";
}