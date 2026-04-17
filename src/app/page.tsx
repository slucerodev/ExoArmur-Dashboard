"use client";

import { HeartPulse, Eye, Brain, Clock, Settings, Plus } from "lucide-react";
import { Header } from "@/components/header";
import { StatCard } from "@/components/stat-card";
import { PipelineFlow } from "@/components/pipeline-flow";
import { EventFeed } from "@/components/event-feed";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStatistics, useObservations, useHealth, useBeliefs } from "@/lib/hooks";
import Link from "next/link";

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useStatistics();
  const { data: health } = useHealth();
  const { data: beliefs, isLoading: beliefsLoading } = useBeliefs({ limit: 10 });

  const ingest = stats?.ingest_statistics as Record<string, number> | undefined;
  const beliefStats = stats?.belief_statistics as Record<string, number> | undefined;

  const totalObservations = ingest?.total_ingested ?? 0;
  const totalBeliefs = beliefStats?.total_beliefs ?? 0;
  const pendingApprovals = ingest?.pending_approvals ?? 0;

  const { data: obsData, isLoading: obsLoading } = useObservations({ limit: 20 });

  const recentRecords = (obsData ?? []).slice(0, 20).map((o) => ({
    audit_id: o.observation_id,
    event_kind: o.observation_type,
    payload_ref: o.payload_data,
    correlation_id: o.correlation_id ?? "",
    trace_id: "",
    tenant_id: "",
    cell_id: o.source_federate_id,
    idempotency_key: o.observation_id,
    created_at: o.timestamp_utc,
  }));

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header pageTitle="Dashboard" />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            title="Pipeline Health"
            value={health?.status === "healthy" ? "Healthy" : "Degraded"}
            icon={HeartPulse}
            color={health?.status === "healthy" ? "success" : "danger"}
            description={health?.service}
            loading={false}
          />
          <StatCard
            title="Total Observations"
            value={totalObservations.toLocaleString()}
            icon={Eye}
            color="default"
            description="Ingested telemetry events"
            loading={statsLoading}
          />
          <StatCard
            title="Active Beliefs"
            value={totalBeliefs.toLocaleString()}
            icon={Brain}
            color="default"
            description="Derived from observations"
            loading={statsLoading}
          />
          <StatCard
            title="Pending Approvals"
            value={pendingApprovals}
            icon={Clock}
            color={pendingApprovals > 0 ? "warning" : "success"}
            description={pendingApprovals > 0 ? "Require human review" : "Queue clear"}
            loading={statsLoading}
          />
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Quick Actions
                </CardTitle>
                <CardDescription>Configure and manage your governance policies</CardDescription>
              </div>
              <Link href="/settings">
                <Button size="sm" variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Link href="/settings">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Policy
              </Button>
            </Link>
            <Link href="/approvals">
              <Button variant="outline">Review Approvals</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Pipeline flow */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Governance Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PipelineFlow stats={stats} compact />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent events */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Recent Events
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <EventFeed records={recentRecords} loading={obsLoading} />
            </CardContent>
          </Card>

          {/* Recent Beliefs */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Recent Beliefs
                </CardTitle>
                <Link href="/beliefs">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {beliefsLoading ? (
                <div className="space-y-2">
                  <div className="h-12 bg-muted rounded animate-pulse" />
                  <div className="h-12 bg-muted rounded animate-pulse" />
                  <div className="h-12 bg-muted rounded animate-pulse" />
                </div>
              ) : beliefs && beliefs.length > 0 ? (
                <div className="space-y-3">
                  {beliefs.slice(0, 5).map((belief) => (
                    <div key={belief.belief_id} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium truncate max-w-[200px]">{belief.belief_type}</span>
                        <span className="text-xs text-muted-foreground">{belief.correlation_id?.slice(0, 20) || "No correlation"}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium">{Math.round(belief.confidence * 100)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No beliefs yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
