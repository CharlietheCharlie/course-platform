"use client";
import { ComponentPropsWithRef, useTransition } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";

export function ActionButton({ action, requireAreYouSure = false, ...props }:
    Omit<ComponentPropsWithRef<"button">, "onClick"> &
    {
        action: () => Promise<{ error: boolean, message: string }>,
        requireAreYouSure?: boolean
    }) {
    const [isLoading, startTransition] = useTransition();

    function performAction() {
        startTransition(async () => {
            const { error, message } = await action();
            if (error) {
                toast.error("Error", { description: message });
            } else {
                toast.success("Action performed successfully");
            }
        });
    }
    return <Button {...props} onClick={performAction}>
        <LoadingTextSwap isLoading={isLoading}>
            {props.children}
        </LoadingTextSwap>
    </Button>
}

function LoadingTextSwap({ isLoading, children }: { isLoading: boolean, children: React.ReactNode }) {
    const commonStyle = "col-start-1 col-end-2 row-start-1 row-end-2";
    return (
        <div className="grid items-center justify-items-center">
            <div
                className={cn(
                    commonStyle,
                    isLoading ? "invisible" : "visible"
                )}>
                {children}
            </div>
            <div
                className={cn(
                    commonStyle,
                    "text-center",
                    isLoading ? "visible" : "invisible"
                )}
            >
                <Loader2Icon className="animate-spin" /> 
            </div>
        </div>
    )
}