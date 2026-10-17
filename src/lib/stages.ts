import type { Stage } from "./types";

export const STAGE_META: Record<
  Stage,
  { label: string; hint: string }
> = {
  applied: { label: "Applied", hint: "New in the door" },
  screening: { label: "Screening", hint: "Recruiter review" },
  interview: { label: "Interview", hint: "In conversation" },
  offer: { label: "Offer", hint: "Offer with the candidate" },
  hired: { label: "Hired", hint: "Accepted" },
  rejected: { label: "Rejected", hint: "Not moving forward" },
};

export const FUNNEL_STAGES: Stage[] = [
  "applied",
  "screening",
  "interview",
  "offer",
  "hired",
];

export const ACTIVE_STAGES: Stage[] = [
  "applied",
  "screening",
  "interview",
  "offer",
];

export const ATTENTION_DAYS = 10;
