import React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { cn } from "@/lib/utils";

function AlertDialog(props) {
  return <AlertDialogPrimitive.Root {...props} />;
}

function AlertDialogTrigger(props) {
  return <AlertDialogPrimitive.Trigger {...props} />;
}

function AlertDialogPortal(props) {
  return <AlertDialogPrimitive.Portal {...props} />;
}

function AlertDialogOverlay({ className, ...props }) {
  return (
    <AlertDialogPrimitive.Overlay
      className={cn(
        "fixed inset-0 z-50 bg-black/50 transition-opacity data-[state=open]:opacity-100 data-[state=closed]:opacity-0",
        className
      )}
      {...props}
    />
  );
}

function AlertDialogContent({ className, children, ...props }) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-sidebar p-5 shadow-lg outline-none transition-all data-[state=open]:opacity-100 data-[state=open]:scale-100 data-[state=closed]:opacity-0 data-[state=closed]:scale-95",
          className
        )}
        {...props}
      >
        {children}
      </AlertDialogPrimitive.Content>
    </AlertDialogPortal>
  );
}

function AlertDialogHeader({ className, ...props }) {
  return (
    <div
      className={cn("mb-4 flex flex-col gap-1.5", className)}
      {...props}
    />
  );
}

function AlertDialogFooter({ className, ...props }) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  );
}

function AlertDialogTitle({ className, ...props }) {
  return (
    <AlertDialogPrimitive.Title
      className={cn("text-base font-semibold text-textPrimary", className)}
      {...props}
    />
  );
}

function AlertDialogDescription({ className, ...props }) {
  return (
    <AlertDialogPrimitive.Description
      className={cn("text-sm text-textSecondary", className)}
      {...props}
    />
  );
}

function AlertDialogAction({ className, ...props }) {
  return (
    <AlertDialogPrimitive.Action
      className={cn(
        "rounded-md bg-accent px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-accent/90",
        className
      )}
      {...props}
    />
  );
}

function AlertDialogCancel({ className, ...props }) {
  return (
    <AlertDialogPrimitive.Cancel
      className={cn(
        "rounded-md border border-border bg-transparent px-4 py-2 text-sm font-medium text-textPrimary transition-colors hover:bg-surfaceHover",
        className
      )}
      {...props}
    />
  );
}

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};