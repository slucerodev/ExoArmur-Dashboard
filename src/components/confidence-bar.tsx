"use client";

import { cn } from "@/lib/utils";

interface ConfidenceBarProps {
  value: number;
  showLabel?: boolean;
  className?: string;
}

function getBarColor(value: number): string {
  if (value >= 0.7) return "bg-green-500";
  if (value >= 0.3) return "bg-amber-500";
  return "bg-red-500";
}

function getLabelColor(value: number): string {
  if (value >= 0.7) return "text-green-400";
  if (value >= 0.3) return "text-amber-400";
  return "text-red-400";
}

export function ConfidenceBar({
  value,
  showLabel = true,
  className,
}: ConfidenceBarProps) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", getBarColor(value))}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className={cn("text-xs font-mono w-8 text-right", getLabelColor(value))}>
          {pct}%
        </span>
      )}
    </div>
  );
}
