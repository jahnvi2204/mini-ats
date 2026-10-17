import { daysSince } from "./format";
import { STAGE_META } from "./stages";
import type { Candidate, CandidateInput, Job, Stage } from "./types";

export type CandidateSort = "recent" | "name" | "rating" | "waiting";

export function jobTitle(jobs: Job[], jobId: string) {
  return jobs.find((job) => job.id === jobId)?.title ?? "Unknown role";
}

export function enteredStageAt(candidate: Candidate) {
  for (let index = candidate.stageHistory.length - 1; index >= 0; index -= 1) {
    if (candidate.stageHistory[index].stage === candidate.stage) {
      return candidate.stageHistory[index].at;
    }
  }
  return candidate.appliedAt;
}

export function daysInStage(candidate: Candidate, now = new Date()) {
  return daysSince(enteredStageAt(candidate), now);
}

export function createCandidate(input: CandidateInput): Candidate {
  const at = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    ...input,
    stage: "applied",
    appliedAt: at,
    stageHistory: [{ stage: "applied", at }],
    notes: [],
  };
}

export function candidateSearchText(candidate: Candidate, jobs: Job[]) {
  const job = jobs.find((item) => item.id === candidate.jobId);
  return [
    candidate.name,
    candidate.email,
    candidate.phone,
    candidate.location,
    candidate.source,
    candidate.skills.join(" "),
    job?.title ?? "",
    job?.department ?? "",
    job?.location ?? "",
    STAGE_META[candidate.stage].label,
  ]
    .join(" ")
    .toLowerCase();
}

export function sortCandidates(
  candidates: Candidate[],
  sort: CandidateSort,
  now = new Date(),
) {
  const next = [...candidates];
  next.sort((a, b) => {
    if (sort === "name") return a.name.localeCompare(b.name);
    if (sort === "rating") {
      return b.rating - a.rating || a.name.localeCompare(b.name);
    }
    if (sort === "waiting") {
      return daysInStage(b, now) - daysInStage(a, now) || a.name.localeCompare(b.name);
    }
    return b.appliedAt.localeCompare(a.appliedAt);
  });
  return next;
}

export function activityLabel(stage: Stage, index: number) {
  if (index === 0 && stage === "applied") return "Applied";
  if (stage === "hired") return "Hired";
  if (stage === "rejected") return "Rejected";
  return `Moved to ${STAGE_META[stage].label}`;
}

function csvCell(value: string | number) {
  const text = String(value);
  if (/[",\n]/.test(text)) return `"${text.replaceAll('"', '""')}"`;
  return text;
}

export function candidatesToCsv(candidates: Candidate[], jobs: Job[]) {
  const header = [
    "Name",
    "Email",
    "Phone",
    "Role",
    "Department",
    "Stage",
    "Source",
    "Location",
    "Experience years",
    "Skills",
    "Rating",
    "Applied",
  ];
  const rows = candidates.map((candidate) => {
    const job = jobs.find((item) => item.id === candidate.jobId);
    return [
      candidate.name,
      candidate.email,
      candidate.phone,
      job?.title ?? "",
      job?.department ?? "",
      STAGE_META[candidate.stage].label,
      candidate.source,
      candidate.location,
      candidate.experienceYears,
      candidate.skills.join("; "),
      candidate.rating,
      candidate.appliedAt,
    ];
  });
  return [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
}
