import { relations } from "drizzle-orm";
import { integer, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelper";
import { CourseSectionTable } from "./courseSection";
import { UserLessonCompleteTable } from "./userLessonComplete";

export const lessonStatuses = ["public", "private", "preview"] as const;
export type LessonStatus = (typeof lessonStatuses)[number];
export const lessonStatusesEnum = pgEnum("lesson_statuses", lessonStatuses);

export const LessonTable = pgTable("lessons", {
  id,
  name: text().notNull(),
  description: text(),
  youtubeVideoId: text().notNull(),
  status: lessonStatusesEnum().notNull().default("private"),
  order: integer().notNull(),
  sectionId: uuid()
    .notNull()
    .references(() => CourseSectionTable.id, { onDelete: "cascade" }),
  createdAt,
  updatedAt,
});

export const LessonRelationShips = relations(LessonTable, ({ one, many }) => ({
  course: one(CourseSectionTable, {
    fields: [LessonTable.sectionId],
    references: [CourseSectionTable.id],
  }),
  userLessonComplete: many(UserLessonCompleteTable),
}));
