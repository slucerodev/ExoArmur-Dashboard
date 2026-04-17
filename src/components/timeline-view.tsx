"use client";

import { useState } from "react";
import { Eye, Brain, ChevronDown, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ConfidenceBar } from "@/components/confidence-bar";
import { formatRelativeTime, truncateId } from "@/lib/utils";
import type { TimelineInfo } from "@/lib/types";

interface TimelineViewProps {
  timeline: TimelineInfo;
}

export function TimelineView({ timeline }: TimelineViewProps) {
  const [expandedObs, setExpandedObs] = useState<Set<string>>(new Set());
  const [expandedBel, setExpandedBel] = useState<Set<string>>(new Set());

  const toggleObs = (id: string) =>
    setExpandedObs((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleBel = (id: string) =>
    setExpandedBel((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <div className="space-y-4">
      <div className="text-xs text-muted-foreground font-mono">
        Correlation: {timeline.correlation_id}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Observations column */}
        <div>
          <div className="flex items-center gap-2 mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <Eye className="h-3.5 w-3.5" /> Observations ({timeline.observations.length})
          </div>
          <div className="space-y-2">
            {timeline.observations.length === 0 ? (
              <p className="text-xs text-muted-foreground">No observations</p>
            ) : (
              timeline.observations.map((obs) => {
                const open = expandedObs.has(obs.observation_id);
                return (
                  <div key={obs.observation_id} className="rounded-md border border-border overflow-hidden">
                    <button
                      className="w-full flex items-center gap-2 p-2.5 hover:bg-muted/40 text-left transition-colors"
                      onClick={() => toggleObs(obs.observation_id)}
                    >
                      {open ? <ChevronDown className="h-3 w-3 shrink-0 text-muted-foreground" /> : <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground" />}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">{obs.observation_type}</Badge>
                          <span className="text-[10px] text-muted-foreground font-mono">{formatRelativeTime(obs.timestamp_utc)}</span>
                        </div>
                        <ConfidenceBar value={obs.confidence} className="mt-1.5" />
                      </div>
                    </button>
                    {open && (
                      <div className="border-t border-border bg-muted/20 p-2.5">
                        <p className="text-[11px] text-muted-foreground mb-1">ID: <span className="font-mono">{truncateId(obs.observation_id, 20)}</span></p>
                        <pre className="text-[10px] text-muted-foreground overflow-x-auto rounded bg-muted/50 p-2 max-h-32">
                          {JSON.stringify(obs.payload_data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Beliefs column */}
        <div>
          <div className="flex items-center gap-2 mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <Brain className="h-3.5 w-3.5" /> Beliefs ({timeline.beliefs.length})
          </div>
          <div className="space-y-2">
            {timeline.beliefs.length === 0 ? (
              <p className="text-xs text-muted-foreground">No beliefs derived</p>
            ) : (
              timeline.beliefs.map((b) => {
                const open = expandedBel.has(b.belief_id);
                return (
                  <div key={b.belief_id} className="rounded-md border border-border overflow-hidden">
                    <button
                      className="w-full flex items-center gap-2 p-2.5 hover:bg-muted/40 text-left transition-colors"
                      onClick={() => toggleBel(b.belief_id)}
                    >
                      {open ? <ChevronDown className="h-3 w-3 shrink-0 text-muted-foreground" /> : <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground" />}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">{b.belief_type}</Badge>
                          <span className="text-[10px] text-muted-foreground font-mono">{formatRelativeTime(b.derived_at)}</span>
                          {b.conflicts.length > 0 && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-red-500/10 text-red-400 border-red-500/30">
                              {b.conflicts.length} conflict{b.conflicts.length > 1 ? "s" : ""}
                            </Badge>
                          )}
                        </div>
                        <ConfidenceBar value={b.confidence} className="mt-1.5" />
                      </div>
                    </button>
                    {open && (
                      <div className="border-t border-border bg-muted/20 p-2.5 space-y-1.5">
                        <p className="text-[11px] text-muted-foreground">ID: <span className="font-mono">{truncateId(b.belief_id, 20)}</span></p>
                        <p className="text-[11px] text-foreground/80">{b.evidence_summary}</p>
                        {b.source_observations.length > 0 && (
                          <p className="text-[10px] text-muted-foreground">
                            Sources: {b.source_observations.map(id => truncateId(id, 10)).join(", ")}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
