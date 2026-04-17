import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 5) return "just now";
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

export function truncateId(id: string, length = 12): string {
  if (!id) return "";
  if (id.length <= length) return id;
  return `${id.slice(0, length)}…`;
}

export function formatConfidence(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function getConfidenceColor(value: number): string {
  if (value >= 0.7) return "text-green-500";
  if (value >= 0.3) return "text-amber-500";
  return "text-red-500";
}
