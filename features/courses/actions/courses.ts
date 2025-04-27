"use server";

import { z } from "zod";
import { courseSchema } from "../schemas/courses";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/services/clerk";
import { canCreateCourses, canDeleteCourses } from "../permissions/courses";
import { insertCourse } from "../db/courses";

export async function createCourse(unsafeData: z.infer<typeof courseSchema>) {
  const { success, data } = courseSchema.safeParse(unsafeData);

  if (!success || !canCreateCourses(await getCurrentUser())) {
    return { error: true, message: "There was an error creating your course" };
  }

  const course = await insertCourse(data);

  redirect(`/admin/courses/${course.id}/edit`);
}

function wait(number: number) {
    return new Promise(res=>setTimeout(res,number));
}

export async function deleteCourse(id: string) {
  await wait(1000);
  if (!canDeleteCourses(await getCurrentUser()) || true) {
    return { error: true, message: "Error deleting your course" };
  }

  await deleteCourse(id);

  return { error: false, message: "Course deleted successfully" };
}
