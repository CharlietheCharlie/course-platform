import { ActionButton } from "@/components/ActionButton";
import { Button } from "@/components/ui/button";
import { db } from "@/drizzle/db";
import {
  LessonStatus,
  LessonTable,
  UserLessonCompleteTable,
} from "@/drizzle/schema";
import { updateLessonCompleteStatus } from "@/features/lessons/actions/userLessonComplete";
import YoutubeVideoPlayer from "@/features/lessons/components/YoutubeVideoPlayer";
import { getLessonIdTag } from "@/features/lessons/db/cache/lessons";
import { getUserLessonCompleteIdTag } from "@/features/lessons/db/cache/userLessonComplete";
import {
  canViewLesson,
  wherePublicLessons,
} from "@/features/lessons/permissions/lessons";
import { canUpdateUserLessonCompleteStatus } from "@/features/lessons/permissions/userLessonComplete";
import { getCurrentUser } from "@/services/clerk";
import { and, eq } from "drizzle-orm";
import { CheckSquare2Icon, LockIcon, XSquareIcon } from "lucide-react";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const { courseId, lessonId } = await params;
  const lesson = await getLesson(lessonId);
  if (lesson == null) return notFound();
  return (
    <Suspense fallback={<div></div>}>
      <SuspenseBoundary courseId={courseId} lesson={lesson}></SuspenseBoundary>
    </Suspense>
  );
}

function LoadingSkeleton() {}

async function SuspenseBoundary({
  courseId,
  lesson,
}: {
  courseId: string;
  lesson: {
    id: string;
    youtubeVideoId: string;
    name: string;
    description: string | null;
    status: LessonStatus;
    sectionId: string;
  };
}) {
  const { userId, role } = await getCurrentUser();
  const isLessonCompleted =
    userId == null
      ? false
      : await getIsLessonCompleted({ userId, lessonId: lesson.id });
  const canView = await canViewLesson({ userId, role }, lesson);
  const canUpdateCompleteStatus = await canUpdateUserLessonCompleteStatus(
    {
      userId,
    },
    lesson.id
  );

  return (
    <div className="my-4 flex flex-col gap-4">
      <div className="aspect-video">
        {canView ? (
          <YoutubeVideoPlayer
            videoId={lesson.youtubeVideoId}
            onFinishedVideo={undefined}
          ></YoutubeVideoPlayer>
        ) : (
          <div className="flex items-center justify-center bg-primary text-primary-foreground h-full w-full">
            <LockIcon className="size-16"></LockIcon>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-start gap-4">
          <h1 className="text-2xl font-semibold">{lesson.name}</h1>
          <div className="flex gap-2 justify-end">
            <Button asChild variant={"outline"}>
              <Link href={`/courses/${courseId}`}>Previous</Link>
            </Button>
            {canUpdateCompleteStatus && (
              <ActionButton
                action={updateLessonCompleteStatus.bind(null, lesson.id, !isLessonCompleted)}
                variant="outline"
              >
                <div className="flex gap-2 items-center">
                  {isLessonCompleted ? (
                    <>
                      <CheckSquare2Icon />
                      Mark Incomplete
                    </>
                  ) : (
                    <>
                      <XSquareIcon />
                      Mark Complete
                    </>
                  )}
                </div>
              </ActionButton>
            )}

            <Button asChild variant={"outline"}>
              <Link href={`/courses/${courseId}`}>Next</Link>
            </Button>
          </div>
        </div>
        {canView ? (
          lesson.description && <p>{lesson.description}</p>
        ) : (
          <p>This lesson is locked. Please purchase the course to view it.</p>
        )}
      </div>
    </div>
  );
}

async function getLesson(lessonId: string) {
  "use cache";
  cacheTag(getLessonIdTag(lessonId));

  return db.query.LessonTable.findFirst({
    columns: {
      id: true,
      youtubeVideoId: true,
      name: true,
      description: true,
      status: true,
      sectionId: true,
    },
    where: and(wherePublicLessons, eq(LessonTable.id, lessonId)),
  });
}

async function getIsLessonCompleted({
  userId,
  lessonId,
}: {
  userId: string;
  lessonId: string;
}) {
  "use cache";
  cacheTag(getUserLessonCompleteIdTag({ lessonId, userId }));

  const data = await db.query.UserLessonCompleteTable.findFirst({
    columns: {
      lessonId: true,
    },
    where: and(
      eq(UserLessonCompleteTable.userId, userId),
      eq(UserLessonCompleteTable.lessonId, lessonId)
    ),
  });

  return data != null;
}
