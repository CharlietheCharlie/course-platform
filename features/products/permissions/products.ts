import { userRole } from "@/drizzle/schema";

export function canCreateProducts(user: { role: userRole | undefined }) {
  return user.role === "admin";
}

export function canUpdateProducts(user: { role: userRole | undefined }) {
  return user.role === "admin";
}

export function canDeleteProducts(user: { role: userRole | undefined }) {
  return user.role === "admin";
}