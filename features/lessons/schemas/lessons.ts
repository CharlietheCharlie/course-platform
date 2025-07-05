import { lessonStatusesEnum } from "@/drizzle/schema";
import { z } from "zod";

export const lessonSchema = z.object({
    name: z.string().min(1, "Required"),
    description: z.string().transform(v => (v === "" ? null : v)).nullable(),
    youtubeVideoId: z.string().min(1, "Required"),
    status: z.enum(lessonStatusesEnum.enumValues),
    sectionId: z.string().min(1, "Required")
})