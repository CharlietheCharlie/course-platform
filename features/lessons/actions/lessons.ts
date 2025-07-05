"use server";

import { z } from "zod";
import { getCurrentUser } from "@/services/clerk";
import { lessonSchema } from "../schemas/lessons";

import {
    insertLesson,
    deleteLesson as deleteLessonDb,
    updateLesson as updateLessonDb,
    updateLessonOrders as updateLessonOrdersDb,
    getNextCourseLessonOrder
} from "../db/lessons";
import { canCreateLessons, canDeleteLessons, canUpdateLessons } from "../permissions/lessons";


export async function createLesson(unsafeData: z.infer<typeof lessonSchema>) {
    const { success, data } = lessonSchema.safeParse(unsafeData);
    if (!success || !canCreateLessons(await getCurrentUser())) {
        return { error: true, message: "There was an error creating your lesson" };
    }

    const order = await getNextCourseLessonOrder(data.sectionId);

    await insertLesson({ ...data, order });

    return { error: false, message: "Lesson created successfully" };
}

export async function updateLesson(
    id: string,
    unsafeData: z.infer<typeof lessonSchema>
) {
    const { success, data } = lessonSchema.safeParse(unsafeData);

    if (!success || !canUpdateLessons(await getCurrentUser())) {
        return { error: true, message: "There was an error updating your lesson" };
    }

    await updateLessonDb(id, data);

    return { error: false, message: "Lesson updated successfully" };
}

export async function deleteLesson(id: string) {
    if (!canDeleteLessons (await getCurrentUser())) {
        return { error: true, message: "Error deleting your lesson" };
    }

    await deleteLessonDb(id);

    return { error: false, message: "Lesson deleted successfully" };
}

export async function updateLessonOrders(lessonIds: string[]) {
    if (lessonIds.length === 0 || !canUpdateLessons(await getCurrentUser())) {
        return { error: true, message: "There was an error updating your lesson" };
    }
    await updateLessonOrdersDb(lessonIds)

    return { error: false, message: "Lesson updated successfully" };
}
