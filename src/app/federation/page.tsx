"use client";

import { Network } from "lucide-react";
import { Header } from "@/components/header";
import { FederationMap } from "@/components/federation-map";
import { EmptyState } from "@/components/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useFederates, useArbitrations } from "@/lib/hooks";
import { formatRelativeTime, truncateId } from "@/lib/utils";

export default function FederationPage() {
  const { data: federates, isLoading: fedLoading, error: fedError } = useFederates();
  const { data: arbitrations, isLoading: arbLoading } = useArbitrations();

  const healthy = (federates ?? []).filter(
    (f) => ["healthy", "active"].includes(f.cell_status.toLowerCase())
  ).length;
  const degraded = (federates ?? []).filter(
    (f) => f.cell_status.toLowerCase() === "degraded"
  ).length;
  const total = federates?.length ?? 0;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header pageTitle="Federation Status" />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Health summary */}
        {!fedLoading && (federates?.length ?? 0) > 0 && (
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Federation cells:</span>
              <span className="font-semibold">{total}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-sm text-green-400">{healthy} healthy</span>
            </div>
            {degraded > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="text-sm text-amber-400">{degraded} degraded</span>
              </div>
            )}
          </div>
        )}

        {/* Cell grid */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Federation Cells
            </CardTitle>
          </CardHeader>
          <CardContent>
            {fedLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)}
              </div>
            ) : fedError || !federates?.length ? (
              <EmptyState
                icon={Network}
                title="Federation not enabled"
                description="No federate cells registered. Enable federation via EXOARMUR_FLAG_V2_FEDERATION_ENABLED=true and register cells to see them here."
              />
            ) : (
              <FederationMap federates={federates} />
            )}
          </CardContent>
        </Card>

        {/* Arbitrations */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Arbitrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {arbLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
              </div>
            ) : !arbitrations?.length ? (
              <EmptyState
                icon={Network}
                title="No arbitrations"
                description="Arbitrations are created when federation cells disagree on a belief. None active."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground text-xs">
                      <th className="text-left py-2 pr-4 font-medium">ID</th>
                      <th className="text-left py-2 pr-4 font-medium">Status</th>
                      <th className="text-left py-2 pr-4 font-medium">Conflict Type</th>
                      <th className="text-left py-2 pr-4 font-medium">Subject</th>
                      <th className="text-left py-2 font-medium">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {arbitrations.map((a) => (
                      <tr key={a.arbitration_id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-2 pr-4 font-mono text-xs text-muted-foreground">
                          {truncateId(a.arbitration_id)}
                        </td>
                        <td className="py-2 pr-4">
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            {a.status}
                          </Badge>
                        </td>
                        <td className="py-2 pr-4 text-xs">{a.conflict_type}</td>
                        <td className="py-2 pr-4 text-xs font-mono text-muted-foreground">
                          {truncateId(a.subject_key, 14)}
                        </td>
                        <td className="py-2 text-xs text-muted-foreground">
                          {formatRelativeTime(a.created_at_utc)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
