"use client"

import { cn } from "@/lib/utils";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useId, useOptimistic, useState, useTransition } from "react";
import {CSS} from '@dnd-kit/utilities'
import { toast } from "sonner";
import { GripVerticalIcon } from "lucide-react";

export function SortableList<T extends { id: string }>({
    items,
    onOrderChange,
    children }: {
        items: T[],
        onOrderChange: (newOrder: string[]) => Promise<{ error: boolean, message: string }>,
        children: (items: T[]) => React.ReactNode
    }
) {
    const dndContextId = useId();
    const [optimisticItems, setOptimisticItems] = useOptimistic(items);
    const [,startTransition] = useTransition();
    function handleDragEnd(event: DragEndEvent) {
        const {active, over} = event;
        const activeId = active?.id.toString();
        const overId = over?.id.toString();
        if(activeId == null || overId == null) return;

        function getNewArray( array: T[], activeId: string, overId: string) {
            const oldIndex = array.findIndex(item => item.id === activeId);
            const newIndex = array.findIndex(item => item.id === overId);
            return arrayMove(array, oldIndex, newIndex);
        }

        startTransition(async()=>{
            setOptimisticItems(items => getNewArray(items, activeId, overId));
            const result = await onOrderChange(getNewArray(items, activeId, overId).map(item => item.id));
            if(result.error) {
              toast.error("Error", { description: result.message });
            }else{
              toast.success(result.message);
            }

        })

    }
    return <DndContext id={dndContextId} onDragEnd={handleDragEnd}>
        <SortableContext
            items={items}
            strategy={verticalListSortingStrategy}>
            <div className="flex flex-col">
                {children(optimisticItems)}
            </div>
        </SortableContext>
    </DndContext>

}



export function SortableItem({ id, children, className }: 
    { id: string, children: React.ReactNode, className?: string }) {

    const {setNodeRef, transform, transition, activeIndex, index, attributes, listeners} = useSortable({ id }); // dnd-kit hook
    const isActive = activeIndex === index;
    return <div ref={setNodeRef}
        style={{
            transform: CSS.Transform.toString(transform),
            transition
        }}
        className={cn("flex gap-1 items-center bg-background rounded-lg p-2", isActive && "z-10 border shadow-md") }>
        <GripVerticalIcon className="text-muted-foreground size-6 p-1" {...attributes} {...listeners}></GripVerticalIcon>
        <div className={cn("flex-grow" , className)}>
            {children}
        </div>
    </div>

}