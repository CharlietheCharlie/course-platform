"use client";
import { ComponentPropsWithRef, useTransition } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";

export function ActionButton({ action, requireAreYouSure = false, ...props }:
    Omit<ComponentPropsWithRef<typeof Button>, "onClick"> &
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

    if (requireAreYouSure) {
        return (
            <AlertDialog open={isLoading ? true : undefined}>
                <AlertDialogTrigger asChild>
                    <Button {...props}></Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction disabled={isLoading} onClick={performAction}>
                            <LoadingTextSwap isLoading={isLoading}>Yes</LoadingTextSwap>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>

            </AlertDialog>
        )
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