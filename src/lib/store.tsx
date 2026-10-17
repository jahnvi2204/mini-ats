"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createCandidate } from "./people";
import { buildSeed } from "./seed";
import { STAGE_META } from "./stages";
import type { Candidate, CandidateInput, DeskState, Job, Stage } from "./types";

const STORAGE_KEY = "harbor-ats-v1";

interface FormState {
  mode: "create" | "edit";
  candidateId?: string;
}

interface DeskContextValue {
  jobs: Job[];
  candidates: Candidate[];
  ready: boolean;
  candidateId: string | null;
  form: FormState | null;
  toast: string | null;
  openCandidate: (id: string) => void;
  closeCandidate: () => void;
  openCreate: () => void;
  openEdit: (id: string) => void;
  closeForm: () => void;
  addCandidate: (input: CandidateInput) => void;
  updateCandidate: (id: string, input: CandidateInput) => void;
  moveStage: (id: string, stage: Stage) => void;
  addNote: (id: string, body: string) => void;
  removeCandidate: (id: string) => void;
  reset: () => void;
}

const DeskContext = createContext<DeskContextValue | null>(null);

function parseState(raw: string): DeskState | null {
  try {
    const data = JSON.parse(raw) as DeskState;
    if (!Array.isArray(data.jobs) || !Array.isArray(data.candidates)) return null;
    return data;
  } catch {
    return null;
  }
}

function replaceCandidateParam(id: string | null) {
  const url = new URL(window.location.href);
  if (id) url.searchParams.set("c", id);
  else url.searchParams.delete("c");
  window.history.pushState({}, "", url);
}

function subscribeToNothing() {
  return () => {};
}

function useIsClient() {
  return useSyncExternalStore(subscribeToNothing, () => true, () => false);
}

function loadDesk(): DeskState {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  const parsed = saved ? parseState(saved) : null;
  return parsed ?? buildSeed();
}

export function DeskProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [ready, setReady] = useState(false);
  const [candidateId, setCandidateId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const candidatesRef = useRef(candidates);
  const pathname = usePathname();
  const [seenPath, setSeenPath] = useState(pathname);
  const isClient = useIsClient();

  if (isClient && !ready) {
    const loaded = loadDesk();
    setJobs(loaded.jobs);
    setCandidates(loaded.candidates);
    setCandidateId(new URLSearchParams(window.location.search).get("c"));
    setReady(true);
  }

  if (ready && pathname !== seenPath) {
    setSeenPath(pathname);
    setCandidateId(null);
  }

  useEffect(() => {
    candidatesRef.current = candidates;
  }, [candidates]);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ jobs, candidates }));
  }, [ready, jobs, candidates]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    const sync = () => {
      setCandidateId(new URLSearchParams(window.location.search).get("c"));
    };
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  const openCandidate = useCallback((id: string) => {
    replaceCandidateParam(id);
    setCandidateId(id);
  }, []);

  const closeCandidate = useCallback(() => {
    replaceCandidateParam(null);
    setCandidateId(null);
  }, []);

  const openCreate = useCallback(() => setForm({ mode: "create" }), []);
  const openEdit = useCallback((id: string) => setForm({ mode: "edit", candidateId: id }), []);
  const closeForm = useCallback(() => setForm(null), []);

  const addCandidate = useCallback((input: CandidateInput) => {
    const next = createCandidate(input);
    setCandidates((current) => [next, ...current]);
    setForm(null);
    setToast(`${next.name} added to Applied`);
    replaceCandidateParam(next.id);
    setCandidateId(next.id);
  }, []);

  const updateCandidate = useCallback((id: string, input: CandidateInput) => {
    setCandidates((current) =>
      current.map((candidate) =>
        candidate.id === id ? { ...candidate, ...input } : candidate,
      ),
    );
    setForm(null);
    setToast(`${input.name} updated`);
  }, []);

  const moveStage = useCallback((id: string, stage: Stage) => {
    const candidate = candidatesRef.current.find((item) => item.id === id);
    if (!candidate || candidate.stage === stage) return;
    const at = new Date().toISOString();
    setToast(`${candidate.name} moved to ${STAGE_META[stage].label}`);
    setCandidates((current) =>
      current.map((item) =>
        item.id === id && item.stage !== stage
          ? {
              ...item,
              stage,
              stageHistory: [...item.stageHistory, { stage, at }],
            }
          : item,
      ),
    );
  }, []);

  const addNote = useCallback((id: string, body: string) => {
    const trimmed = body.trim();
    if (!trimmed) return;
    setCandidates((current) =>
      current.map((candidate) =>
        candidate.id === id
          ? {
              ...candidate,
              notes: [
                { id: crypto.randomUUID(), body: trimmed, at: new Date().toISOString() },
                ...candidate.notes,
              ],
            }
          : candidate,
      ),
    );
    setToast("Note added");
  }, []);

  const removeCandidate = useCallback((id: string) => {
    setCandidates((current) => current.filter((candidate) => candidate.id !== id));
    setCandidateId((current) => (current === id ? null : current));
    replaceCandidateParam(null);
    setToast("Candidate removed");
  }, []);

  const reset = useCallback(() => {
    const seed = buildSeed();
    setJobs(seed.jobs);
    setCandidates(seed.candidates);
    setForm(null);
    setCandidateId(null);
    replaceCandidateParam(null);
    setToast("Sample desk restored");
  }, []);

  const value = useMemo(
    () => ({
      jobs,
      candidates,
      ready,
      candidateId,
      form,
      toast,
      openCandidate,
      closeCandidate,
      openCreate,
      openEdit,
      closeForm,
      addCandidate,
      updateCandidate,
      moveStage,
      addNote,
      removeCandidate,
      reset,
    }),
    [
      jobs,
      candidates,
      ready,
      candidateId,
      form,
      toast,
      openCandidate,
      closeCandidate,
      openCreate,
      openEdit,
      closeForm,
      addCandidate,
      updateCandidate,
      moveStage,
      addNote,
      removeCandidate,
      reset,
    ],
  );

  return <DeskContext.Provider value={value}>{children}</DeskContext.Provider>;
}

export function useDesk() {
  const value = useContext(DeskContext);
  if (!value) throw new Error("useDesk must be used within DeskProvider");
  return value;
}
