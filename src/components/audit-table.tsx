"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, ChevronRight } from "lucide-react";
import { formatRelativeTime, truncateId } from "@/lib/utils";
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
  return KIND_COLORS[kind] ?? "bg-muted text-muted-foreground border-border";
}

interface AuditTableProps {
  records: AuditRecord[];
}

export function AuditTable({ records }: AuditTableProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const sorted = [...records].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <ScrollArea className="max-h-[500px]">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-background z-10">
          <tr className="border-b border-border text-muted-foreground text-xs">
            <th className="text-left py-2 pr-2 font-medium w-6"></th>
            <th className="text-left py-2 pr-4 font-medium">Audit ID</th>
            <th className="text-left py-2 pr-4 font-medium">Event Kind</th>
            <th className="text-left py-2 pr-4 font-medium">Timestamp</th>
            <th className="text-left py-2 pr-4 font-medium">Tenant</th>
            <th className="text-left py-2 font-medium">Cell</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((record) => {
            const isOpen = expanded.has(record.audit_id);
            return (
              <>
                <tr
                  key={record.audit_id}
                  className="border-b border-border/50 hover:bg-muted/30 cursor-pointer transition-colors"
                  onClick={() => toggle(record.audit_id)}
                >
                  <td className="py-2 pr-2 text-muted-foreground">
                    {isOpen ? (
                      <ChevronDown className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5" />
                    )}
                  </td>
                  <td className="py-2 pr-4 font-mono text-xs text-muted-foreground">
                    {truncateId(record.audit_id)}
                  </td>
                  <td className="py-2 pr-4">
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-1.5 py-0 ${kindClass(record.event_kind)}`}
                    >
                      {record.event_kind.replace(/_/g, " ")}
                    </Badge>
                  </td>
                  <td className="py-2 pr-4 text-xs text-muted-foreground">
                    {formatRelativeTime(record.created_at)}
                  </td>
                  <td className="py-2 pr-4 text-xs text-muted-foreground font-mono">
                    {truncateId(record.tenant_id, 10) || "—"}
                  </td>
                  <td className="py-2 text-xs text-muted-foreground font-mono">
                    {truncateId(record.cell_id, 10) || "—"}
                  </td>
                </tr>
                {isOpen && (
                  <tr key={`${record.audit_id}-detail`} className="border-b border-border/50 bg-muted/20">
                    <td colSpan={6} className="py-3 px-4">
                      <pre className="text-xs text-muted-foreground overflow-x-auto rounded bg-muted/50 p-3 max-h-48">
                        {JSON.stringify(record.payload_ref, null, 2)}
                      </pre>
                    </td>
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
      </table>
    </ScrollArea>
  );
}
