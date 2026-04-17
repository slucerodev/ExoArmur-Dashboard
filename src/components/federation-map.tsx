"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatRelativeTime, truncateId } from "@/lib/utils";
import type { FederateInfo } from "@/lib/types";

const STATUS_COLORS: Record<string, string> = {
  healthy: "bg-green-500/15 text-green-400 border-green-500/30",
  active: "bg-green-500/15 text-green-400 border-green-500/30",
  degraded: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  offline: "bg-red-500/15 text-red-400 border-red-500/30",
  unknown: "bg-muted text-muted-foreground border-border",
};

function statusClass(status: string): string {
  return STATUS_COLORS[status.toLowerCase()] ?? STATUS_COLORS.unknown;
}

interface FederationMapProps {
  federates: FederateInfo[];
}

export function FederationMap({ federates }: FederationMapProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
      {federates.map((f) => (
        <Card key={f.federate_id} className="overflow-hidden">
          <CardContent className="pt-4 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-mono text-foreground/90 truncate">
                {truncateId(f.federate_id, 20)}
              </p>
              <Badge
                variant="outline"
                className={`text-[10px] px-1.5 py-0 shrink-0 ${statusClass(f.cell_status)}`}
              >
                {f.cell_status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Role</p>
                <p className="text-xs">{f.federation_role}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Updated</p>
                <p className="text-xs">{formatRelativeTime(f.updated_at)}</p>
              </div>
            </div>

            {f.public_key && (
              <p className="text-[10px] text-muted-foreground font-mono truncate">
                Key: {f.public_key.slice(0, 24)}…
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
