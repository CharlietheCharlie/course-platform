"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CourseSectionStatus } from "@/drizzle/schema";
import SectionForm from "./SectionForm";
import { useState } from "react";

export function SectionFormDialog({ courseId, section, children }: {
    courseId: string;
    section?: { id: string; name: string; status: CourseSectionStatus; order: number; };
    children: React.ReactNode;
}) {
    const [isOpen, setIsOpen] = useState(false);
    return <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {children}
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    {section ? `Edit ${section.name}` : "New Section"}
                </DialogTitle>
            </DialogHeader>
            <div className="mt-4">
                <SectionForm courseId={courseId} section={section} onSuccess={() => setIsOpen(false)}></SectionForm>
            </div>
        </DialogContent>
    </Dialog>
}