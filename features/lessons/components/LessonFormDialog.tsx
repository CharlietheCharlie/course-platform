"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LessonStatus } from "@/drizzle/schema";
import { useState } from "react";
import LessonForm from "./LessonForm";

export function LessonFormDialog({
  defaultSectionId,
  sections,
  lesson,
  children,
}: {
  defaultSectionId?: string;
  sections: { id: string; name: string }[];
  children: React.ReactNode;
  lesson: {
    id: string;
    name: string;
    status: LessonStatus;
    description: string | null;
    youtubeVideoId: string;
    sectionId: string;
  };
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {lesson ? `Edit ${lesson.name}` : "New Lesson"}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <LessonForm
            sections={sections}
            defaultSectionId={defaultSectionId}
            lesson={lesson}
            onSuccess={() => setIsOpen(false)}
          ></LessonForm>
        </div>
      </DialogContent>
    </Dialog>
  );
}
