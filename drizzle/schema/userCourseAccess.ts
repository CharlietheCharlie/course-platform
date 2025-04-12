import { relations } from "drizzle-orm";
import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { createdAt, updatedAt } from "../schemaHelper";
import { UserTable } from "./user";
import { CourseTable } from "./course";

export const userCourseAccessTable = pgTable(
  "user_course_access",
  {
    userId: uuid()
      .notNull()
      .references(() => UserTable.id, { onDelete: "cascade" }),
    courseId: uuid()
      .notNull()
      .references(() => CourseTable.id, { onDelete: "cascade" }),
    createdAt,
    updatedAt,
  },
  (t) => [primaryKey({ columns: [t.userId, t.courseId] })]
);

export const UserCourseAccessRelationShips = relations(
  userCourseAccessTable,
  ({ one }) => ({
    user: one(UserTable, {
      fields: [userCourseAccessTable.userId],
      references: [UserTable.id],
    }),
    course: one(CourseTable, {
      fields: [userCourseAccessTable.courseId],
      references: [CourseTable.id],
    }),
  })
);
