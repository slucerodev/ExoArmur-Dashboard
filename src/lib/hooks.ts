import useSWR from "swr";
import { api } from "./api";

const FAST_REFRESH = 5_000;
const SLOW_REFRESH = 30_000;

export function useHealth() {
  return useSWR("health", () => api.health(), { refreshInterval: FAST_REFRESH });
}

export function useStatistics() {
  return useSWR("statistics", () => api.getStatistics(), {
    refreshInterval: FAST_REFRESH,
  });
}

export function useBeliefs(params?: { correlation_id?: string; limit?: number }) {
  const key = params ? `beliefs-${JSON.stringify(params)}` : "beliefs";
  return useSWR(key, () => api.getBeliefs(params), {
    refreshInterval: FAST_REFRESH,
  });
}

export function useObservations(params?: {
  correlation_id?: string;
  limit?: number;
}) {
  const key = params ? `observations-${JSON.stringify(params)}` : "observations";
  return useSWR(key, () => api.getObservations(params), {
    refreshInterval: FAST_REFRESH,
  });
}

export function useAuditRecords(correlationId: string | null) {
  return useSWR(
    correlationId ? `audit-${correlationId}` : null,
    () => api.getAuditRecords(correlationId!),
    { refreshInterval: SLOW_REFRESH }
  );
}

export function useTimeline(correlationId: string | null) {
  return useSWR(
    correlationId ? `timeline-${correlationId}` : null,
    () => api.getTimeline(correlationId!),
    { refreshInterval: SLOW_REFRESH }
  );
}

export function useFederates() {
  return useSWR("federates", () => api.getFederates(), {
    refreshInterval: SLOW_REFRESH,
  });
}

export function useArbitrations() {
  return useSWR("arbitrations", () => api.getArbitrations(), {
    refreshInterval: FAST_REFRESH,
  });
}
