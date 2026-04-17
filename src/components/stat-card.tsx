"use client";

import { type LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type StatColor = "default" | "success" | "warning" | "danger";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  color?: StatColor;
  loading?: boolean;
}

const colorMap: Record<StatColor, string> = {
  default: "text-blue-400",
  success: "text-green-400",
  warning: "text-amber-400",
  danger: "text-red-400",
};

const bgMap: Record<StatColor, string> = {
  default: "bg-blue-500/10",
  success: "bg-green-500/10",
  warning: "bg-amber-500/10",
  danger: "bg-red-500/10",
};

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  color = "default",
  loading = false,
}: StatCardProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mb-1" />
          <Skeleton className="h-3 w-32" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn("rounded-md p-2", bgMap[color])}>
          <Icon className={cn("h-4 w-4", colorMap[color])} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
