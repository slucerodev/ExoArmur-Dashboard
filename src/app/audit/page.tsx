"use client";

import { useState, useCallback } from "react";
import { Search, ScrollText } from "lucide-react";
import { Header } from "@/components/header";
import { AuditTable } from "@/components/audit-table";
import { TimelineView } from "@/components/timeline-view";
import { EmptyState } from "@/components/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuditRecords, useTimeline } from "@/lib/hooks";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

function AuditContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCorrelationId = searchParams.get("correlation_id") ?? "";
  const [inputValue, setInputValue] = useState(initialCorrelationId);
  const [activeId, setActiveId] = useState(initialCorrelationId);

  const { data: auditData, isLoading: auditLoading, error: auditError } = useAuditRecords(activeId || null);
  const { data: timeline, isLoading: timelineLoading } = useTimeline(activeId || null);

  const handleSearch = useCallback(() => {
    const trimmed = inputValue.trim();
    setActiveId(trimmed);
    if (trimmed) {
      router.replace(`/audit?correlation_id=${trimmed}`, { scroll: false });
    }
  }, [inputValue, router]);

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter correlation_id to search audit records…"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="font-mono text-sm"
            />
            <Button onClick={handleSearch} disabled={!inputValue.trim()}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {!activeId && (
        <EmptyState
          icon={ScrollText}
          title="Enter a correlation ID"
          description="Paste a correlation_id from a telemetry ingest response to see its full audit trail and timeline."
        />
      )}

      {activeId && (
        <>
          {/* Timeline */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Correlation Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              {timelineLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-48" />
                  <div className="grid grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
                  </div>
                </div>
              ) : timeline ? (
                <TimelineView timeline={timeline} />
              ) : (
                <EmptyState
                  icon={ScrollText}
                  title="No timeline data"
                  description="Timeline requires V2 visibility to be enabled. Check feature flags."
                />
              )}
            </CardContent>
          </Card>

          {/* Audit records table */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Audit Records
                {auditData && (
                  <span className="ml-2 font-mono text-xs">
                    ({auditData.total_count})
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {auditLoading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                </div>
              ) : auditError ? (
                <EmptyState
                  icon={ScrollText}
                  title="No records found"
                  description={`No audit records for correlation ID: ${activeId}`}
                />
              ) : auditData?.audit_records.length ? (
                <AuditTable records={auditData.audit_records} />
              ) : (
                <EmptyState
                  icon={ScrollText}
                  title="No audit records"
                  description="No records found for this correlation ID."
                />
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

export default function AuditPage() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header pageTitle="Audit Trail" />
      <main className="flex-1 overflow-y-auto p-6">
        <Suspense fallback={<Skeleton className="h-12 w-full" />}>
          <AuditContent />
        </Suspense>
      </main>
    </div>
  );
}
