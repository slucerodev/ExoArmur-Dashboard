"use client";

import { useState } from "react";
import { Brain } from "lucide-react";
import { Header } from "@/components/header";
import { BeliefCard } from "@/components/belief-card";
import { EmptyState } from "@/components/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBeliefs } from "@/lib/hooks";

export default function BeliefsPage() {
  const [correlationFilter, setCorrelationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [minConfidence, setMinConfidence] = useState(0);

  const { data: beliefs, isLoading } = useBeliefs(
    correlationFilter ? { correlation_id: correlationFilter, limit: 100 } : { limit: 100 }
  );

  const filtered = (beliefs ?? []).filter((b) => {
    if (typeFilter && !b.belief_type.toLowerCase().includes(typeFilter.toLowerCase())) return false;
    if (b.confidence < minConfidence / 100) return false;
    return true;
  });

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header pageTitle="Beliefs Explorer" />
      <main className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Filter bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Correlation ID</Label>
            <Input
              placeholder="Filter by correlation_id…"
              value={correlationFilter}
              onChange={(e) => setCorrelationFilter(e.target.value)}
              className="font-mono text-xs h-8"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Belief Type</Label>
            <Input
              placeholder="e.g. anomaly, threat…"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-xs h-8"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">
              Min Confidence: {minConfidence}%
            </Label>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={minConfidence}
              onChange={(e) => setMinConfidence(Number(e.target.value))}
              className="w-full h-8 accent-primary"
            />
          </div>
        </div>

        {/* Results count */}
        {!isLoading && beliefs && (
          <p className="text-xs text-muted-foreground">
            Showing {filtered.length} of {beliefs.length} beliefs
          </p>
        )}

        {/* Beliefs grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Brain}
            title="No beliefs found"
            description={
              beliefs?.length
                ? "No beliefs match the current filters. Try adjusting the confidence threshold or clearing filters."
                : "No beliefs have been derived yet. Ingest telemetry to generate beliefs."
            }
            action={
              (typeFilter || correlationFilter || minConfidence > 0)
                ? {
                    label: "Clear filters",
                    onClick: () => {
                      setTypeFilter("");
                      setCorrelationFilter("");
                      setMinConfidence(0);
                    },
                  }
                : undefined
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((belief) => (
              <BeliefCard key={belief.belief_id} belief={belief} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
