import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelper";
import { UserCourseAccessTable } from "./userCourseAccess";
import { relations } from "drizzle-orm";


export const userRoles = ["user", "admin"] as const;
export type userRole = (typeof userRoles)[number];
export const userRoleEnum = pgEnum("user_roles", userRoles);

export const UserTable = pgTable("users", {
    id,
    clerkUserId: text().notNull().unique(),
    email: text().notNull(),
    name: text().notNull(),
    role: userRoleEnum().notNull().default("user"),
    imageUrl:text(),
    deletedAt: timestamp({ withTimezone: true }),
    createdAt,
    updatedAt,
});

export const UserRelationShips = relations(UserTable, ({ many }) => ({
    userCourseAccesses: many(UserCourseAccessTable),
}))