"use client";

import { useEffect, useState } from "react";
import { stagePillClass } from "@/components/ui";
import { formatDate } from "@/lib/format";
import { activityLabel, jobTitle } from "@/lib/people";
import { STAGE_META } from "@/lib/stages";
import { useDesk } from "@/lib/store";
import { STAGES } from "@/lib/types";

export function CandidateDrawer() {
  const {
    jobs,
    candidates,
    candidateId,
    closeCandidate,
    moveStage,
    addNote,
    openEdit,
    removeCandidate,
  } = useDesk();
  const candidate = candidates.find((item) => item.id === candidateId) ?? null;

  useEffect(() => {
    if (!candidate) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCandidate();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [candidate, closeCandidate]);

  if (!candidate) return null;

  const job = jobs.find((item) => item.id === candidate.jobId);
  const timeline = [
    ...candidate.stageHistory.map((event, index) => ({
      id: `stage-${index}`,
      at: event.at,
      text: activityLabel(event.stage, index),
    })),
    ...candidate.notes.map((note) => ({
      id: note.id,
      at: note.at,
      text: note.body,
    })),
  ].sort((a, b) => b.at.localeCompare(a.at));

  return (
    <div className="fixed inset-0 z-40" data-testid="candidate-drawer">
      <button
        type="button"
        aria-label="Close candidate"
        className="absolute inset-0 bg-[#1c1915]/40"
        onClick={closeCandidate}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="candidate-name"
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col overflow-y-auto bg-raised shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-raised px-5 py-4">
          <p className="text-xs uppercase tracking-[0.16em] text-brass">Candidate</p>
          <button
            type="button"
            onClick={closeCandidate}
            className="rounded-full border border-line px-3 py-1 text-sm"
          >
            Close
          </button>
        </div>

        <div className="space-y-6 px-5 py-5">
          <div>
            <h2 id="candidate-name" className="font-display text-4xl tracking-tight">
              {candidate.name}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {jobTitle(jobs, candidate.jobId)}
              {job ? ` · ${job.department}` : ""} · {candidate.location}
            </p>
            <p className="mt-2 text-sm">
              <a className="text-forest underline-offset-2 hover:underline" href={`mailto:${candidate.email}`}>
                {candidate.email}
              </a>
              {candidate.phone ? <span className="text-muted"> · {candidate.phone}</span> : null}
            </p>
          </div>

          <section>
            <h3 className="text-xs uppercase tracking-[0.14em] text-faint">Stage</h3>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {STAGES.map((stage) => {
                const selected = candidate.stage === stage;
                return (
                  <button
                    key={stage}
                    type="button"
                    data-testid={`move-${stage}`}
                    aria-pressed={selected}
                    onClick={() => moveStage(candidate.id, stage)}
                    className={`rounded-xl border px-3 py-2 text-left text-sm ${
                      selected
                        ? "border-ink bg-ink text-paper"
                        : "border-line bg-paper hover:border-line-strong"
                    }`}
                  >
                    {STAGE_META[stage].label}
                  </button>
                );
              })}
            </div>
          </section>

          <dl className="grid grid-cols-2 gap-3 text-sm">
            <Fact label="Source" value={candidate.source} />
            <Fact label="Experience" value={`${candidate.experienceYears} years`} />
            <Fact label="Rating" value={`${candidate.rating} / 5`} />
            <Fact label="Applied" value={formatDate(candidate.appliedAt)} />
          </dl>

          <section>
            <h3 className="text-xs uppercase tracking-[0.14em] text-faint">Skills</h3>
            <ul className="mt-2 flex flex-wrap gap-2">
              {candidate.skills.map((skill) => (
                <li key={skill} className={`rounded-full px-2.5 py-1 text-xs ${stagePillClass("applied")}`}>
                  {skill}
                </li>
              ))}
            </ul>
          </section>

          <NoteComposer key={candidate.id} candidateId={candidate.id} onAdd={addNote} />

          <section>
            <h3 className="text-xs uppercase tracking-[0.14em] text-faint">History</h3>
            <ol className="mt-3 space-y-3 border-l border-line pl-4" data-testid="history">
              {timeline.map((item) => (
                <li key={item.id} className="relative">
                  <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-brass" />
                  <p className="text-sm">{item.text}</p>
                  <p className="text-xs text-faint">{formatDate(item.at)}</p>
                </li>
              ))}
            </ol>
          </section>

          <div className="flex flex-wrap gap-3 pb-6">
            <button
              type="button"
              data-testid="edit-candidate"
              onClick={() => openEdit(candidate.id)}
              className="rounded-full border border-line-strong px-4 py-2 text-sm"
            >
              Edit profile
            </button>
            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Remove ${candidate.name} from the desk?`)) {
                  removeCandidate(candidate.id);
                }
              }}
              className="rounded-full px-4 py-2 text-sm text-clay"
            >
              Remove
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

function NoteComposer({
  candidateId,
  onAdd,
}: {
  candidateId: string;
  onAdd: (id: string, body: string) => void;
}) {
  const [draft, setDraft] = useState("");
  return (
    <section>
      <h3 className="text-xs uppercase tracking-[0.14em] text-faint">Note</h3>
      <form
        className="mt-2 space-y-2"
        onSubmit={(event) => {
          event.preventDefault();
          onAdd(candidateId, draft);
          setDraft("");
        }}
      >
        <label htmlFor="note-input" className="sr-only">
          Add a note
        </label>
        <textarea
          id="note-input"
          data-testid="note-input"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          rows={3}
          placeholder="What happened in the last conversation?"
          className="w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-brass"
        />
        <button
          type="submit"
          data-testid="save-note"
          className="rounded-full bg-forest px-4 py-2 text-sm text-white"
        >
          Save note
        </button>
      </form>
    </section>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-paper px-3 py-2">
      <dt className="text-xs uppercase tracking-[0.14em] text-faint">{label}</dt>
      <dd className="mt-1">{value}</dd>
    </div>
  );
}
