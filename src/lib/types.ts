export const STAGES = [
  "applied",
  "screening",
  "interview",
  "offer",
  "hired",
  "rejected",
] as const;

export type Stage = (typeof STAGES)[number];

export const SOURCES = [
  "LinkedIn",
  "Referral",
  "Careers page",
  "Campus",
  "Agency",
] as const;

export type Source = (typeof SOURCES)[number];

export type JobStatus = "open" | "closed";

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: "Full-time" | "Contract";
  openings: number;
  status: JobStatus;
}

export interface StageEvent {
  stage: Stage;
  at: string;
}

export interface Note {
  id: string;
  body: string;
  at: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  jobId: string;
  stage: Stage;
  source: Source;
  location: string;
  experienceYears: number;
  skills: string[];
  rating: number;
  appliedAt: string;
  stageHistory: StageEvent[];
  notes: Note[];
}

export interface DeskState {
  jobs: Job[];
  candidates: Candidate[];
}

export interface CandidateInput {
  name: string;
  email: string;
  phone: string;
  jobId: string;
  source: Source;
  location: string;
  experienceYears: number;
  skills: string[];
  rating: number;
}
