"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "next-themes";
import { toast } from "sonner";

const DEFAULTS = {
  api_url: "http://localhost:8000",
  operator_id: "dashboard-operator",
  refresh_interval: "5000",
};

function read(key: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  return localStorage.getItem(`exoarmur_${key}`) ?? fallback;
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  const [apiUrl, setApiUrl] = useState(DEFAULTS.api_url);
  const [operatorId, setOperatorId] = useState(DEFAULTS.operator_id);
  const [refreshInterval, setRefreshInterval] = useState(DEFAULTS.refresh_interval);

  useEffect(() => {
    setApiUrl(read("api_url", DEFAULTS.api_url));
    setOperatorId(read("operator_id", DEFAULTS.operator_id));
    setRefreshInterval(read("refresh_interval", DEFAULTS.refresh_interval));
  }, []);

  const handleSave = () => {
    localStorage.setItem("exoarmur_api_url", apiUrl);
    localStorage.setItem("exoarmur_operator_id", operatorId);
    localStorage.setItem("exoarmur_refresh_interval", refreshInterval);
    toast.success("Settings saved", {
      description: "Changes take effect on next data fetch.",
    });
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header pageTitle="Settings" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-xl space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Connection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="api-url">Backend API URL</Label>
                <Input
                  id="api-url"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  placeholder="http://localhost:8000"
                  className="font-mono text-sm"
                />
                <p className="text-[11px] text-muted-foreground">
                  The base URL of your running ExoArmur backend.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="operator-id">Operator ID</Label>
                <Input
                  id="operator-id"
                  value={operatorId}
                  onChange={(e) => setOperatorId(e.target.value)}
                  placeholder="dashboard-operator"
                  className="font-mono text-sm"
                />
                <p className="text-[11px] text-muted-foreground">
                  Used as the operator_id when approving or denying requests.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Display</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Refresh Interval</Label>
                <Select
                  value={refreshInterval}
                  onValueChange={(v) => v && setRefreshInterval(v)}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1000">1 second</SelectItem>
                    <SelectItem value="5000">5 seconds</SelectItem>
                    <SelectItem value="15000">15 seconds</SelectItem>
                    <SelectItem value="30000">30 seconds</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-muted-foreground">
                  How often active data panels auto-refresh.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label>Theme</Label>
                <Select value={theme ?? "dark"} onValueChange={(v) => v && setTheme(v)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </main>
    </div>
  );
}
