"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { formatRelativeTime, truncateId } from "@/lib/utils";
import { ScrollText } from "lucide-react";
import type { AuditRecord } from "@/lib/types";

const KIND_COLORS: Record<string, string> = {
  telemetry_ingested: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  safety_gate_evaluated: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  intent_executed: "bg-green-500/15 text-green-400 border-green-500/30",
  approval_requested: "bg-red-500/15 text-red-400 border-red-500/30",
  approval_granted: "bg-green-500/15 text-green-400 border-green-500/30",
  approval_denied: "bg-red-500/15 text-red-400 border-red-500/30",
};

function kindClass(kind: string): string {
  return (
    KIND_COLORS[kind] ??
    "bg-muted text-muted-foreground border-border"
  );
}

interface EventFeedProps {
  records: AuditRecord[];
  loading?: boolean;
  maxHeight?: string;
}

export function EventFeed({
  records,
  loading = false,
  maxHeight = "320px",
}: EventFeedProps) {
  const router = useRouter();

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 py-2">
            <Skeleton className="h-3 w-16 shrink-0" />
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (!records.length) {
    return (
      <EmptyState
        icon={ScrollText}
        title="No events yet"
        description="Events will appear here as the pipeline processes telemetry."
      />
    );
  }

  return (
    <ScrollArea style={{ maxHeight }}>
      <div className="space-y-1">
        {records.map((record) => (
          <div
            key={record.audit_id}
            className="flex items-center gap-3 py-2 px-1 rounded hover:bg-muted/50 cursor-pointer transition-colors"
            onClick={() =>
              router.push(`/audit?correlation_id=${record.correlation_id}`)
            }
          >
            <span className="text-[11px] text-muted-foreground font-mono w-14 shrink-0">
              {formatRelativeTime(record.created_at)}
            </span>
            <Badge
              variant="outline"
              className={`text-[10px] font-medium px-1.5 py-0 shrink-0 ${kindClass(record.event_kind)}`}
            >
              {record.event_kind.replace(/_/g, " ")}
            </Badge>
            <span className="text-[11px] text-muted-foreground font-mono truncate">
              {truncateId(record.correlation_id, 16)}
            </span>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
