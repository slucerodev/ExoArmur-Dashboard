import type {
  HealthResponse,
  TelemetryEvent,
  TelemetryIngestResponse,
  AuditResponse,
  ApprovalStatusResponse,
  ApprovalResponse,
  FederateInfo,
  ObservationInfo,
  BeliefInfo,
  TimelineInfo,
  VisibilityStats,
  ArbitrationInfo,
  ContainmentStatus,
} from "./types";

function getApiBase(): string {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("exoarmur_api_url");
    if (stored) return stored;
  }
  return process.env.NEXT_PUBLIC_EXOARMUR_API_URL || "http://localhost:8000";
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${getApiBase()}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(
      (err as { detail?: string; message?: string }).detail ||
        (err as { message?: string }).message ||
        `API error ${res.status}`
    );
  }
  return res.json() as Promise<T>;
}

export const api = {
  // Health
  health: () => apiFetch<HealthResponse>("/health"),

  // Telemetry
  ingestTelemetry: (event: TelemetryEvent) =>
    apiFetch<TelemetryIngestResponse>("/v1/telemetry/ingest", {
      method: "POST",
      body: JSON.stringify(event),
    }),

  // Audit
  getAuditRecords: (correlationId: string) =>
    apiFetch<AuditResponse>(`/v1/audit/${correlationId}`),

  // Approvals
  getApprovalStatus: (approvalId: string) =>
    apiFetch<ApprovalStatusResponse>(`/v1/approvals/${approvalId}`),

  approveRequest: (approvalId: string, operatorId: string) =>
    apiFetch<ApprovalResponse>(`/v1/approvals/${approvalId}/approve`, {
      method: "POST",
      body: JSON.stringify({ operator_id: operatorId }),
    }),

  denyRequest: (approvalId: string, operatorId: string, reason: string) =>
    apiFetch<ApprovalResponse>(`/v1/approvals/${approvalId}/deny`, {
      method: "POST",
      body: JSON.stringify({ operator_id: operatorId, reason }),
    }),

  // V2 Visibility
  getFederates: () =>
    apiFetch<FederateInfo[]>("/api/v2/visibility/federates"),

  getObservations: (params?: { correlation_id?: string; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.correlation_id) qs.set("correlation_id", params.correlation_id);
    if (params?.limit) qs.set("limit", String(params.limit));
    return apiFetch<ObservationInfo[]>(`/api/v2/visibility/observations?${qs}`);
  },

  getBeliefs: (params?: { correlation_id?: string; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.correlation_id) qs.set("correlation_id", params.correlation_id);
    if (params?.limit) qs.set("limit", String(params.limit));
    return apiFetch<BeliefInfo[]>(`/api/v2/visibility/beliefs?${qs}`);
  },

  getTimeline: (correlationId: string) =>
    apiFetch<TimelineInfo>(`/api/v2/visibility/timeline/${correlationId}`),

  getStatistics: () =>
    apiFetch<VisibilityStats>("/api/v2/visibility/statistics"),

  getArbitrations: () =>
    apiFetch<ArbitrationInfo[]>("/api/v2/visibility/arbitrations"),

  // V2 Identity Containment
  getContainmentStatus: (subjectId: string, provider: string) =>
    apiFetch<ContainmentStatus>(
      `/api/v2/identity_containment/status?subject_id=${subjectId}&provider=${provider}`
    ),
};
