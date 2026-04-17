"use client";

import { cn } from "@/lib/utils";

export type HealthStatus = "healthy" | "degraded" | "unreachable";

interface HealthBadgeProps {
  status: HealthStatus;
  className?: string;
}

const statusConfig: Record<
  HealthStatus,
  { dot: string; label: string; badge: string }
> = {
  healthy: {
    dot: "bg-green-500",
    label: "Healthy",
    badge: "text-green-500",
  },
  degraded: {
    dot: "bg-amber-500",
    label: "Degraded",
    badge: "text-amber-500",
  },
  unreachable: {
    dot: "bg-red-500",
    label: "Unreachable",
    badge: "text-red-500",
  },
};

export function HealthBadge({ status, className }: HealthBadgeProps) {
  const config = statusConfig[status];
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <span
        className={cn("inline-block h-2 w-2 rounded-full animate-pulse", config.dot)}
      />
      <span className={cn("text-sm font-medium", config.badge)}>
        {config.label}
      </span>
    </div>
  );
}
