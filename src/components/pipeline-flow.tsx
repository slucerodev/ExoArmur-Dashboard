"use client";

import {
  Radio,
  Zap,
  Brain,
  Users,
  ShieldCheck,
  Play,
  ScrollText,
  ArrowRight,
} from "lucide-react";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VisibilityStats } from "@/lib/types";

interface Stage {
  id: string;
  label: string;
  icon: LucideIcon;
}

const STAGES: Stage[] = [
  { id: "telemetry", label: "Telemetry", icon: Radio },
  { id: "signals", label: "Signal Facts", icon: Zap },
  { id: "beliefs", label: "Beliefs", icon: Brain },
  { id: "collective", label: "Collective", icon: Users },
  { id: "safety", label: "Safety Gate", icon: ShieldCheck },
  { id: "execution", label: "Execution", icon: Play },
  { id: "audit", label: "Audit", icon: ScrollText },
];

function getStageCount(stageId: string, stats: VisibilityStats | undefined): number | null {
  if (!stats) return null;
  const ingest = stats.ingest_statistics as Record<string, number> | undefined;
  const beliefs = stats.belief_statistics as Record<string, number> | undefined;
  const store = stats.store_statistics as Record<string, number> | undefined;

  switch (stageId) {
    case "telemetry":
      return ingest?.total_ingested ?? null;
    case "signals":
      return ingest?.total_signals ?? null;
    case "beliefs":
      return beliefs?.total_beliefs ?? null;
    case "collective":
      return beliefs?.collective_count ?? null;
    case "safety":
      return ingest?.safety_evaluations ?? null;
    case "execution":
      return ingest?.total_executed ?? null;
    case "audit":
      return store?.total_records ?? null;
    default:
      return null;
  }
}

interface PipelineFlowProps {
  stats?: VisibilityStats;
  compact?: boolean;
}

export function PipelineFlow({ stats, compact = false }: PipelineFlowProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-0 overflow-x-auto py-3 px-1",
        compact ? "flex-nowrap" : "flex-wrap justify-center gap-y-4"
      )}
    >
      {STAGES.map((stage, idx) => {
        const count = getStageCount(stage.id, stats);
        const Icon = stage.icon;
        return (
          <div key={stage.id} className="flex items-center shrink-0">
            <div
              className={cn(
                "flex flex-col items-center rounded-lg border px-3 py-2 transition-colors",
                compact ? "min-w-[80px]" : "min-w-[100px]",
                "bg-card border-border hover:border-primary/50"
              )}
            >
              <div className="rounded-md bg-primary/10 p-1.5 mb-1">
                <Icon
                  className={cn(
                    "text-primary",
                    compact ? "h-3.5 w-3.5" : "h-4 w-4"
                  )}
                />
              </div>
              <span
                className={cn(
                  "font-medium text-center leading-tight",
                  compact ? "text-[10px]" : "text-xs"
                )}
              >
                {stage.label}
              </span>
              {count !== null && (
                <span className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                  {count.toLocaleString()}
                </span>
              )}
            </div>
            {idx < STAGES.length - 1 && (
              <ArrowRight
                className={cn(
                  "text-muted-foreground/40 shrink-0 mx-0.5",
                  compact ? "h-3 w-3" : "h-4 w-4"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
