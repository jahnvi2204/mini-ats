import { daysSince } from "./format";
import { activityLabel, daysInStage, jobTitle } from "./people";
import { ACTIVE_STAGES, ATTENTION_DAYS, FUNNEL_STAGES, STAGE_META } from "./stages";
import type { Candidate, Job, Source, Stage } from "./types";

export interface FunnelStep {
  stage: Stage;
  label: string;
  reached: number;
  current: number;
  conversion: number | null;
}

export interface SourceSlice {
  source: Source;
  count: number;
}

export interface StageAging {
  stage: Stage;
  label: string;
  count: number;
  averageDays: number | null;
}

export interface AttentionItem {
  candidate: Candidate;
  days: number;
  role: string;
}

export interface ActivityItem {
  id: string;
  candidateId: string;
  name: string;
  role: string;
  at: string;
  label: string;
}

export interface DashboardMetrics {
  total: number;
  active: number;
  hired: number;
  rejected: number;
  openRoles: number;
  openSeats: number;
  hireRate: number | null;
  averageTimeToHire: number | null;
  averageActiveWait: number | null;
  funnel: FunnelStep[];
  sources: SourceSlice[];
  aging: StageAging[];
  attention: AttentionItem[];
  activity: ActivityItem[];
}

function reached(candidate: Candidate, stage: Stage) {
  return candidate.stageHistory.some((event) => event.stage === stage);
}

function hiredAt(candidate: Candidate) {
  for (let index = candidate.stageHistory.length - 1; index >= 0; index -= 1) {
    if (candidate.stageHistory[index].stage === "hired") {
      return candidate.stageHistory[index].at;
    }
  }
  return null;
}

function average(values: number[]) {
  if (values.length === 0) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function buildMetrics(
  jobs: Job[],
  candidates: Candidate[],
  now = new Date(),
): DashboardMetrics {
  const active = candidates.filter((candidate) =>
    ACTIVE_STAGES.includes(candidate.stage),
  );
  const hired = candidates.filter((candidate) => candidate.stage === "hired");
  const rejected = candidates.filter((candidate) => candidate.stage === "rejected");
  const decided = hired.length + rejected.length;
  const openJobs = jobs.filter((job) => job.status === "open");

  const funnel: FunnelStep[] = FUNNEL_STAGES.map((stage, index) => {
    const reachedCount = candidates.filter((candidate) => reached(candidate, stage)).length;
    const previous =
      index === 0
        ? null
        : candidates.filter((candidate) => reached(candidate, FUNNEL_STAGES[index - 1])).length;
    return {
      stage,
      label: STAGE_META[stage].label,
      reached: reachedCount,
      current: candidates.filter((candidate) => candidate.stage === stage).length,
      conversion:
        previous === null || previous === 0 ? null : (reachedCount / previous) * 100,
    };
  });

  const sourceCounts = new Map<Source, number>();
  for (const candidate of candidates) {
    sourceCounts.set(candidate.source, (sourceCounts.get(candidate.source) ?? 0) + 1);
  }

  const aging: StageAging[] = FUNNEL_STAGES.concat("rejected").map((stage) => {
    const group = candidates.filter((candidate) => candidate.stage === stage);
    return {
      stage,
      label: STAGE_META[stage].label,
      count: group.length,
      averageDays: average(group.map((candidate) => daysInStage(candidate, now))),
    };
  });

  const attention = active
    .map((candidate) => ({
      candidate,
      days: daysInStage(candidate, now),
      role: jobTitle(jobs, candidate.jobId),
    }))
    .filter((item) => item.days >= ATTENTION_DAYS)
    .sort((a, b) => b.days - a.days);

  const activity: ActivityItem[] = candidates
    .flatMap((candidate) =>
      candidate.stageHistory.map((event, index) => ({
        id: `${candidate.id}-${index}-${event.stage}`,
        candidateId: candidate.id,
        name: candidate.name,
        role: jobTitle(jobs, candidate.jobId),
        at: event.at,
        label: activityLabel(event.stage, index),
      })),
    )
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 8);

  return {
    total: candidates.length,
    active: active.length,
    hired: hired.length,
    rejected: rejected.length,
    openRoles: openJobs.length,
    openSeats: openJobs.reduce((sum, job) => sum + job.openings, 0),
    hireRate: decided === 0 ? null : (hired.length / decided) * 100,
    averageTimeToHire: average(
      hired.flatMap((candidate) => {
        const at = hiredAt(candidate);
        return at ? [daysSince(candidate.appliedAt, new Date(at))] : [];
      }),
    ),
    averageActiveWait: average(active.map((candidate) => daysInStage(candidate, now))),
    funnel,
    sources: [...sourceCounts.entries()]
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count || a.source.localeCompare(b.source)),
    aging,
    attention,
    activity,
  };
}
