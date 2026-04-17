"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ConfidenceBar } from "@/components/confidence-bar";
import { formatRelativeTime, truncateId } from "@/lib/utils";
import type { BeliefInfo } from "@/lib/types";

interface BeliefCardProps {
  belief: BeliefInfo;
}

export function BeliefCard({ belief }: BeliefCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="overflow-hidden">
      <CardHeader
        className="pb-2 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => setExpanded((p) => !p)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            {expanded ? (
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 shrink-0">
                  {belief.belief_type}
                </Badge>
                {belief.conflicts.length > 0 && (
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 py-0 bg-red-500/10 text-red-400 border-red-500/30 shrink-0 flex items-center gap-1"
                  >
                    <AlertTriangle className="h-2.5 w-2.5" />
                    {belief.conflicts.length} conflict{belief.conflicts.length > 1 ? "s" : ""}
                  </Badge>
                )}
              </div>
              <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                {truncateId(belief.belief_id, 24)}
              </p>
            </div>
          </div>
          <span className="text-[10px] text-muted-foreground shrink-0">
            {formatRelativeTime(belief.derived_at)}
          </span>
        </div>
      </CardHeader>

      <CardContent className="pb-3 pt-0 px-4">
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
          {belief.evidence_summary}
        </p>
        <ConfidenceBar value={belief.confidence} />
      </CardContent>

      {expanded && (
        <div className="border-t border-border bg-muted/20 px-4 py-3 space-y-3">
          <div>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
              Evidence Summary
            </p>
            <p className="text-xs">{belief.evidence_summary}</p>
          </div>

          {belief.source_observations.length > 0 && (
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                Source Observations ({belief.source_observations.length})
              </p>
              <div className="space-y-0.5">
                {belief.source_observations.map((id) => (
                  <p key={id} className="text-[11px] font-mono text-muted-foreground">
                    {id}
                  </p>
                ))}
              </div>
            </div>
          )}

          {belief.conflicts.length > 0 && (
            <div>
              <p className="text-[10px] font-medium text-red-400 uppercase tracking-wider mb-1">
                Conflicts
              </p>
              <div className="space-y-0.5">
                {belief.conflicts.map((id) => (
                  <p key={id} className="text-[11px] font-mono text-red-400/70">
                    {id}
                  </p>
                ))}
              </div>
            </div>
          )}

          {belief.correlation_id && (
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                Correlation ID
              </p>
              <p className="text-[11px] font-mono text-muted-foreground">
                {belief.correlation_id}
              </p>
            </div>
          )}

          {Object.keys(belief.metadata).length > 0 && (
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                Metadata
              </p>
              <pre className="text-[10px] text-muted-foreground overflow-x-auto rounded bg-muted/50 p-2">
                {JSON.stringify(belief.metadata, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
