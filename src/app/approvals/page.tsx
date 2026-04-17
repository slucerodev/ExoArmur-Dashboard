"use client";

import { useState, useCallback } from "react";
import { ShieldCheck, RefreshCw } from "lucide-react";
import { Header } from "@/components/header";
import { ApprovalCard } from "@/components/approval-card";
import { EmptyState } from "@/components/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { toast } from "sonner";
import useSWR from "swr";
import type { ApprovalStatusResponse } from "@/lib/types";

export default function ApprovalsPage() {
  const [manualId, setManualId] = useState("");
  const [fetchedApprovals, setFetchedApprovals] = useState<ApprovalStatusResponse[]>([]);
  const [fetching, setFetching] = useState(false);

  const handleFetch = useCallback(async () => {
    const id = manualId.trim();
    if (!id) return;
    setFetching(true);
    try {
      const result = await api.getApprovalStatus(id);
      setFetchedApprovals((prev) => {
        const exists = prev.find((a) => a.approval_id === result.approval_id);
        if (exists) return prev.map((a) => a.approval_id === result.approval_id ? result : a);
        return [result, ...prev];
      });
      setManualId("");
    } catch {
      toast.error("Not found", { description: `No approval with ID: ${id}` });
    } finally {
      setFetching(false);
    }
  }, [manualId]);

  const refresh = useCallback(async () => {
    const updated = await Promise.allSettled(
      fetchedApprovals.map((a) => api.getApprovalStatus(a.approval_id))
    );
    setFetchedApprovals(
      updated
        .filter((r) => r.status === "fulfilled")
        .map((r) => (r as PromiseFulfilledResult<ApprovalStatusResponse>).value)
    );
  }, [fetchedApprovals]);

  const pending = fetchedApprovals.filter((a) => a.status === "PENDING");
  const approved = fetchedApprovals.filter((a) => a.status === "APPROVED");
  const denied = fetchedApprovals.filter((a) => a.status === "DENIED");

  const renderList = (list: ApprovalStatusResponse[]) => {
    if (!list.length) {
      return (
        <EmptyState
          icon={ShieldCheck}
          title="No approvals in this category"
          description="Use the search field above to look up an approval by ID."
        />
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
        {list.map((a) => (
          <ApprovalCard key={a.approval_id} approval={a} onAction={refresh} />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header pageTitle="Approval Queue" />
      <main className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Lookup bar */}
        <div className="flex gap-2">
          <Input
            placeholder="Enter approval_id to look up…"
            value={manualId}
            onChange={(e) => setManualId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleFetch()}
            className="font-mono text-sm"
          />
          <Button onClick={handleFetch} disabled={!manualId.trim() || fetching}>
            {fetching ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Fetch"}
          </Button>
          {fetchedApprovals.length > 0 && (
            <Button variant="outline" onClick={refresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh all
            </Button>
          )}
        </div>

        {fetchedApprovals.length === 0 ? (
          <EmptyState
            icon={ShieldCheck}
            title="No approvals loaded"
            description="When telemetry requires human approval, an approval_id is returned in the ingest response. Enter it above to manage it here."
          />
        ) : (
          <Tabs defaultValue="pending">
            <TabsList>
              <TabsTrigger value="pending">
                Pending {pending.length > 0 && `(${pending.length})`}
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved {approved.length > 0 && `(${approved.length})`}
              </TabsTrigger>
              <TabsTrigger value="denied">
                Denied {denied.length > 0 && `(${denied.length})`}
              </TabsTrigger>
              <TabsTrigger value="all">All ({fetchedApprovals.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="pending">{renderList(pending)}</TabsContent>
            <TabsContent value="approved">{renderList(approved)}</TabsContent>
            <TabsContent value="denied">{renderList(denied)}</TabsContent>
            <TabsContent value="all">{renderList(fetchedApprovals)}</TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}
