"use client";

import { useState } from "react";
import { Check, X, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { formatRelativeTime, truncateId } from "@/lib/utils";
import type { ApprovalStatusResponse } from "@/lib/types";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  APPROVED: "bg-green-500/15 text-green-400 border-green-500/30",
  DENIED: "bg-red-500/15 text-red-400 border-red-500/30",
};

function getOperatorId(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem("exoarmur_operator_id") ?? "dashboard-operator";
  }
  return "dashboard-operator";
}

interface ApprovalCardProps {
  approval: ApprovalStatusResponse;
  onAction: () => void;
}

export function ApprovalCard({ approval, onAction }: ApprovalCardProps) {
  const router = useRouter();
  const [denyOpen, setDenyOpen] = useState(false);
  const [denyReason, setDenyReason] = useState("");
  const [loading, setLoading] = useState(false);

  const statusClass = STATUS_COLORS[approval.status] ?? "bg-muted text-muted-foreground border-border";

  const handleApprove = async () => {
    setLoading(true);
    try {
      await api.approveRequest(approval.approval_id, getOperatorId());
      toast.success("Approval granted", {
        description: `Approval ${truncateId(approval.approval_id)} approved.`,
      });
      onAction();
    } catch (e) {
      toast.error("Failed to approve", {
        description: (e as Error).message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeny = async () => {
    if (!denyReason.trim()) return;
    setLoading(true);
    try {
      await api.denyRequest(approval.approval_id, getOperatorId(), denyReason.trim());
      toast.success("Approval denied", {
        description: `Approval ${truncateId(approval.approval_id)} denied.`,
      });
      setDenyOpen(false);
      onAction();
    } catch (e) {
      toast.error("Failed to deny", {
        description: (e as Error).message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${statusClass}`}>
                  {approval.status}
                </Badge>
                <span className="text-[10px] text-muted-foreground">
                  {formatRelativeTime(approval.created_at)}
                </span>
              </div>
              <p className="text-xs font-mono text-muted-foreground">
                {truncateId(approval.approval_id, 24)}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
              Action Class
            </p>
            <p className="text-xs font-medium">{approval.requested_action_class}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
              Correlation ID
            </p>
            <button
              className="text-xs font-mono text-primary/80 hover:text-primary flex items-center gap-1 transition-colors"
              onClick={() => router.push(`/audit?correlation_id=${approval.correlation_id}`)}
            >
              {truncateId(approval.correlation_id, 20)}
              <ExternalLink className="h-2.5 w-2.5" />
            </button>
          </div>

          {approval.status === "PENDING" && (
            <div className="flex gap-2 pt-1">
              <Button
                size="sm"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                onClick={handleApprove}
                disabled={loading}
              >
                <Check className="h-3.5 w-3.5 mr-1.5" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10"
                onClick={() => setDenyOpen(true)}
                disabled={loading}
              >
                <X className="h-3.5 w-3.5 mr-1.5" />
                Deny
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={denyOpen} onOpenChange={setDenyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deny Approval</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Denying approval for:{" "}
              <span className="font-mono">{truncateId(approval.approval_id, 20)}</span>
            </p>
            <div className="space-y-1.5">
              <Label htmlFor="reason">Reason (required)</Label>
              <Textarea
                id="reason"
                placeholder="Enter the reason for denial…"
                value={denyReason}
                onChange={(e) => setDenyReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDenyOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDeny}
              disabled={loading || !denyReason.trim()}
            >
              <X className="h-3.5 w-3.5 mr-1.5" />
              Confirm Deny
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
