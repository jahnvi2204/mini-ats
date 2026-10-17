const TIME_ZONE = "Asia/Kolkata";

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: TIME_ZONE,
  }).format(new Date(iso));
}

export function formatLongDate(date = new Date()) {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: TIME_ZONE,
  }).format(date);
}

export function daysSince(iso: string, now = new Date()) {
  const elapsed = now.getTime() - new Date(iso).getTime();
  return Math.max(0, Math.floor(elapsed / 86_400_000));
}

export function formatDays(value: number | null) {
  if (value === null || Number.isNaN(value)) return "—";
  const rounded = Math.round(value);
  if (rounded === 1) return "1 day";
  return `${rounded} days`;
}

export function formatPercent(value: number | null) {
  if (value === null || Number.isNaN(value)) return "—";
  return `${Math.round(value)}%`;
}

export function formatCount(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}
