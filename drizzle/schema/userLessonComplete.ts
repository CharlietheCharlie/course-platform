import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { createdAt, updatedAt } from "../schemaHelper";
import { UserTable } from "./user";
import { LessonTable } from "./lesson";
import { relations } from "drizzle-orm";

export const UserLessonCompleteTable = pgTable(
  "user_lesson_complete",
  {
    userId: uuid()
      .notNull()
      .references(() => UserTable.id, { onDelete: "cascade" }),
    lessonId: uuid()
      .notNull()
      .references(() => LessonTable.id, { onDelete: "cascade" }),
    createdAt,
    updatedAt,
  },
  (t) => [primaryKey({ columns: [t.userId, t.lessonId] })]
);

export const UserLessonCompleteRelationShips = relations(
  UserLessonCompleteTable,
  ({ one }) => ({
    user: one(UserTable, {
      fields: [UserLessonCompleteTable.userId],
      references: [UserTable.id],
    }),
    lesson: one(LessonTable, {
      fields: [UserLessonCompleteTable.lessonId],
      references: [LessonTable.id],
    }),
  })
);
