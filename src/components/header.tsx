"use client";

import { Moon, Sun, PanelLeft } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { HealthBadge } from "@/components/health-badge";
import { useHealth } from "@/lib/hooks";
import type { HealthStatus } from "@/components/health-badge";

function getApiBase(): string {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("exoarmur_api_url");
    if (stored) return stored;
  }
  return process.env.NEXT_PUBLIC_EXOARMUR_API_URL || "http://localhost:8000";
}

export function Header({ pageTitle }: { pageTitle: string }) {
  const { theme, setTheme } = useTheme();
  const { data, error } = useHealth();

  const healthStatus: HealthStatus = error
    ? "unreachable"
    : data?.status === "healthy"
    ? "healthy"
    : "degraded";

  return (
    <>
      {healthStatus === "unreachable" && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2 text-sm text-amber-400 flex items-center gap-2">
          <span className="font-medium">Backend unreachable</span>
          <span className="text-amber-400/70">at {getApiBase()} — check connection or update Settings</span>
        </div>
      )}
      <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="-ml-1">
            <PanelLeft className="h-4 w-4" />
          </SidebarTrigger>
          <span className="text-sm font-medium text-foreground">{pageTitle}</span>
        </div>
        <div className="flex items-center gap-3">
          <HealthBadge status={healthStatus} />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </div>
      </header>
    </>
  );
}
