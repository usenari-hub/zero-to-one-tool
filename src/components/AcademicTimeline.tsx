import React from "react";
import { cn } from "@/lib/utils";

type AcademicTimelineProps = {
  items: string[];
  currentStep: number; // index of the current step (0-based)
  className?: string;
};

export function AcademicTimeline({ items, currentStep, className }: AcademicTimelineProps) {
  const clampStep = Math.max(0, Math.min(currentStep, items.length - 1));
  const reversed = [...items].reverse();
  const currentReversed = items.length - 1 - clampStep;

  return (
    <div className={cn("w-full", className)} aria-label="Academic journey steps">
      <ol className="relative border-l-2 border-border pl-4 mt-1 space-y-3">
        {reversed.map((label, i) => {
          const isCompleted = i < currentReversed;
          const isCurrent = i === currentReversed;
          return (
            <li key={i} className="relative">
              <span
                className={cn(
                  "absolute -left-2 top-0.5 grid h-4 w-4 place-items-center rounded-full border",
                  isCompleted && "bg-primary border-primary",
                  isCurrent && "bg-background border-2 border-primary",
                  !isCompleted && !isCurrent && "bg-muted border-border"
                )}
                aria-hidden
              />
              <div className="ml-2">
                <div className={cn("text-sm sm:text-base md:text-lg font-medium", isCompleted ? "text-foreground" : isCurrent ? "text-primary" : "text-muted-foreground")}>{label}</div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

