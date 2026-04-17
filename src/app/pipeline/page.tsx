"use client";

import { Radio, Zap, Brain, Users, ShieldCheck, Play, ScrollText, Database } from "lucide-react";
import { Header } from "@/components/header";
import { PipelineFlow } from "@/components/pipeline-flow";
import { EmptyState } from "@/components/empty-state";
import { ConfidenceBar } from "@/components/confidence-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useStatistics, useBeliefs, useObservations, useArbitrations } from "@/lib/hooks";
import { formatRelativeTime, truncateId } from "@/lib/utils";

export default function PipelinePage() {
  const { data: stats } = useStatistics();
  const { data: beliefs, isLoading: beliefsLoading } = useBeliefs({ limit: 50 });
  const { data: observations, isLoading: obsLoading } = useObservations({ limit: 50 });
  const { data: arbitrations, isLoading: arbLoading } = useArbitrations();

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header pageTitle="Pipeline Monitor" />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Full pipeline diagram */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Governance Pipeline — Stage View
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PipelineFlow stats={stats} compact={false} />
          </CardContent>
        </Card>

        {/* Stage detail tabs */}
        <Tabs defaultValue="ingestion">
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="ingestion" className="gap-1.5">
              <Radio className="h-3.5 w-3.5" />Ingestion
            </TabsTrigger>
            <TabsTrigger value="beliefs" className="gap-1.5">
              <Brain className="h-3.5 w-3.5" />Beliefs
            </TabsTrigger>
            <TabsTrigger value="safety" className="gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />Safety
            </TabsTrigger>
            <TabsTrigger value="arbitration" className="gap-1.5">
              <Users className="h-3.5 w-3.5" />Arbitration
            </TabsTrigger>
            <TabsTrigger value="execution" className="gap-1.5">
              <Play className="h-3.5 w-3.5" />Execution
            </TabsTrigger>
          </TabsList>

          {/* Ingestion tab */}
          <TabsContent value="ingestion" className="mt-4">
            <Card>
              <CardContent className="pt-4">
                {obsLoading ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                  </div>
                ) : !observations?.length ? (
                  <EmptyState icon={Radio} title="No observations" description="Ingest telemetry via POST /v1/telemetry/ingest to see data here." />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground text-xs">
                          <th className="text-left py-2 pr-4 font-medium">ID</th>
                          <th className="text-left py-2 pr-4 font-medium">Type</th>
                          <th className="text-left py-2 pr-4 font-medium">Confidence</th>
                          <th className="text-left py-2 pr-4 font-medium">Federate</th>
                          <th className="text-left py-2 font-medium">Timestamp</th>
                        </tr>
                      </thead>
                      <tbody>
                        {observations.map((obs) => (
                          <tr key={obs.observation_id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                            <td className="py-2 pr-4 font-mono text-xs text-muted-foreground">{truncateId(obs.observation_id)}</td>
                            <td className="py-2 pr-4"><Badge variant="outline" className="text-xs">{obs.observation_type}</Badge></td>
                            <td className="py-2 pr-4 w-32"><ConfidenceBar value={obs.confidence} /></td>
                            <td className="py-2 pr-4 text-xs text-muted-foreground font-mono">{truncateId(obs.source_federate_id)}</td>
                            <td className="py-2 text-xs text-muted-foreground">{formatRelativeTime(obs.timestamp_utc)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Beliefs tab */}
          <TabsContent value="beliefs" className="mt-4">
            <Card>
              <CardContent className="pt-4">
                {beliefsLoading ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                  </div>
                ) : !beliefs?.length ? (
                  <EmptyState icon={Brain} title="No beliefs derived" description="Beliefs are derived from observations during telemetry ingestion." />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground text-xs">
                          <th className="text-left py-2 pr-4 font-medium">Belief ID</th>
                          <th className="text-left py-2 pr-4 font-medium">Type</th>
                          <th className="text-left py-2 pr-4 font-medium">Confidence</th>
                          <th className="text-left py-2 pr-4 font-medium">Evidence</th>
                          <th className="text-left py-2 font-medium">Derived</th>
                        </tr>
                      </thead>
                      <tbody>
                        {beliefs.map((b) => (
                          <tr key={b.belief_id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                            <td className="py-2 pr-4 font-mono text-xs text-muted-foreground">{truncateId(b.belief_id)}</td>
                            <td className="py-2 pr-4"><Badge variant="outline" className="text-xs">{b.belief_type}</Badge></td>
                            <td className="py-2 pr-4 w-32"><ConfidenceBar value={b.confidence} /></td>
                            <td className="py-2 pr-4 text-xs text-muted-foreground max-w-[200px] truncate">{b.evidence_summary}</td>
                            <td className="py-2 text-xs text-muted-foreground">{formatRelativeTime(b.derived_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Safety tab */}
          <TabsContent value="safety" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <EmptyState
                  icon={ShieldCheck}
                  title="Safety evaluations are internal"
                  description="Safety gate verdicts are embedded in audit records. Search a correlation ID in the Audit Trail page to see safety decisions."
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Arbitration tab */}
          <TabsContent value="arbitration" className="mt-4">
            <Card>
              <CardContent className="pt-4">
                {arbLoading ? (
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                  </div>
                ) : !arbitrations?.length ? (
                  <EmptyState icon={Users} title="No arbitrations" description="Arbitrations appear when federation cells disagree on a belief. Requires V2 federation." />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground text-xs">
                          <th className="text-left py-2 pr-4 font-medium">ID</th>
                          <th className="text-left py-2 pr-4 font-medium">Status</th>
                          <th className="text-left py-2 pr-4 font-medium">Conflict Type</th>
                          <th className="text-left py-2 font-medium">Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {arbitrations.map((a) => (
                          <tr key={a.arbitration_id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                            <td className="py-2 pr-4 font-mono text-xs text-muted-foreground">{truncateId(a.arbitration_id)}</td>
                            <td className="py-2 pr-4"><Badge variant="outline" className="text-xs">{a.status}</Badge></td>
                            <td className="py-2 pr-4 text-xs">{a.conflict_type}</td>
                            <td className="py-2 text-xs text-muted-foreground">{formatRelativeTime(a.created_at_utc)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Execution tab */}
          <TabsContent value="execution" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <EmptyState
                  icon={Play}
                  title="Execution intents are internal"
                  description="Execution results are captured in audit records. Search a correlation ID in the Audit Trail page to see intent execution details."
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
