// V1 Response Models
export interface TelemetryIngestResponse {
  accepted: boolean;
  correlation_id: string;
  event_id: string;
  belief_id: string | null;
  processed_at: string;
  trace_id: string;
  approval_id: string | null;
  approval_status: string | null;
  safety_verdict: string | null;
}

export interface AuditRecord {
  audit_id: string;
  event_kind: string;
  payload_ref: Record<string, unknown>;
  correlation_id: string;
  trace_id: string;
  tenant_id: string;
  cell_id: string;
  idempotency_key: string;
  created_at: string;
}

export interface AuditResponse {
  correlation_id: string;
  audit_records: AuditRecord[];
  total_count: number;
  retrieved_at: string;
}

export interface ApprovalStatusResponse {
  approval_id: string;
  status: string;
  created_at: string;
  requested_action_class: string;
  correlation_id: string;
}

export interface ApprovalResponse {
  approval_id: string;
  status: string;
  created_at: string;
}

// V2 Visibility Models
export interface FederateInfo {
  federate_id: string;
  federation_role: string;
  cell_status: string;
  created_at: string;
  updated_at: string;
  public_key: string;
}

export interface ObservationInfo {
  observation_id: string;
  source_federate_id: string;
  timestamp_utc: string;
  correlation_id: string | null;
  observation_type: string;
  confidence: number;
  evidence_refs: string[];
  payload_type: string;
  payload_data: Record<string, unknown>;
}

export interface BeliefInfo {
  belief_id: string;
  belief_type: string;
  confidence: number;
  source_observations: string[];
  derived_at: string;
  correlation_id: string | null;
  evidence_summary: string;
  conflicts: string[];
  metadata: Record<string, unknown>;
}

export interface TimelineInfo {
  correlation_id: string;
  observations: ObservationInfo[];
  beliefs: BeliefInfo[];
}

export interface VisibilityStats {
  ingest_statistics: Record<string, unknown>;
  belief_statistics: Record<string, unknown>;
  store_statistics: Record<string, unknown>;
  timestamp: string;
  arbitration_statistics?: Record<string, unknown>;
}

export interface ArbitrationInfo {
  arbitration_id: string;
  created_at_utc: string;
  status: string;
  conflict_type: string;
  subject_key: string;
  conflict_key: string;
  claims: Record<string, unknown>[];
  evidence_refs: string[];
  correlation_id: string | null;
  proposed_resolution: Record<string, unknown> | null;
  decision: Record<string, unknown> | null;
  approval_id: string | null;
}

export interface ContainmentStatus {
  subject_id: string;
  provider: string;
  scope: string;
  status: string;
  applied_at?: string;
  expires_at?: string;
  approval_id?: string;
}

export interface TelemetryEvent {
  schema_version: string;
  event_id: string;
  event_type: string;
  timestamp: string;
  source: Record<string, string>;
  severity: string;
  tenant_id: string;
  cell_id: string;
  correlation_id: string;
  trace_id: string;
  payload: Record<string, unknown>;
}

export interface HealthResponse {
  status: string;
  service: string;
}
