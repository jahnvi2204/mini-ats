"use client";

import { useEffect, useState } from "react";
import { useDesk } from "@/lib/store";
import { SOURCES, type CandidateInput, type Source } from "@/lib/types";

const EMPTY: CandidateInput = {
  name: "",
  email: "",
  phone: "",
  jobId: "",
  source: "LinkedIn",
  location: "",
  experienceYears: 0,
  skills: [],
  rating: 3,
};

export function CandidateForm() {
  const desk = useDesk();
  if (!desk.form) return null;
  return <CandidateFormDialog key={`${desk.form.mode}-${desk.form.candidateId ?? "new"}`} />;
}

function CandidateFormDialog() {
  const { form, jobs, candidates, closeForm, addCandidate, updateCandidate } = useDesk();
  const editing = candidates.find((candidate) => candidate.id === form?.candidateId) ?? null;
  const [input, setInput] = useState<CandidateInput>(() =>
    editing
      ? {
          name: editing.name,
          email: editing.email,
          phone: editing.phone,
          jobId: editing.jobId,
          source: editing.source,
          location: editing.location,
          experienceYears: editing.experienceYears,
          skills: editing.skills,
          rating: editing.rating,
        }
      : { ...EMPTY, jobId: jobs[0]?.id ?? "" },
  );
  const [skillsText, setSkillsText] = useState(() => editing?.skills.join(", ") ?? "");
  const [error, setError] = useState("");

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeForm();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeForm]);

  if (!form) return null;

  function update<K extends keyof CandidateInput>(key: K, value: CandidateInput[K]) {
    setInput((current) => ({ ...current, [key]: value }));
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const name = input.name.trim();
    const email = input.email.trim();
    if (!name) {
      setError("Add a name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Add a valid email.");
      return;
    }
    if (!input.jobId) {
      setError("Choose a role.");
      return;
    }
    const next: CandidateInput = {
      ...input,
      name,
      email,
      phone: input.phone.trim(),
      location: input.location.trim(),
      skills: skillsText
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
      experienceYears: Number.isFinite(input.experienceYears) ? input.experienceYears : 0,
    };
    if (form?.mode === "edit" && form.candidateId) updateCandidate(form.candidateId, next);
    else addCandidate(next);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4" data-testid="candidate-form">
      <button
        type="button"
        aria-label="Close form"
        className="absolute inset-0 bg-[#10283d]/45"
        onClick={closeForm}
      />
      <form
        onSubmit={submit}
        className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-line bg-raised p-5 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-brass">
              {form.mode === "edit" ? "Edit" : "New"}
            </p>
            <h2 className="font-display text-3xl tracking-tight">
              {form.mode === "edit" ? "Update candidate" : "Add candidate"}
            </h2>
          </div>
          <button type="button" onClick={closeForm} className="text-sm text-muted">
            Close
          </button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Field label="Name" className="sm:col-span-2">
            <input
              data-testid="field-name"
              required
              value={input.name}
              onChange={(event) => update("name", event.target.value)}
              className={fieldClass}
            />
          </Field>
          <Field label="Email">
            <input
              data-testid="field-email"
              type="email"
              required
              value={input.email}
              onChange={(event) => update("email", event.target.value)}
              className={fieldClass}
            />
          </Field>
          <Field label="Phone">
            <input
              value={input.phone}
              onChange={(event) => update("phone", event.target.value)}
              className={fieldClass}
            />
          </Field>
          <Field label="Role" className="sm:col-span-2">
            <select
              data-testid="field-role"
              value={input.jobId}
              onChange={(event) => update("jobId", event.target.value)}
              className={fieldClass}
            >
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                  {job.status === "closed" ? " (closed)" : ""}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Source">
            <select
              value={input.source}
              onChange={(event) => update("source", event.target.value as Source)}
              className={fieldClass}
            >
              {SOURCES.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </Field>
          <Field label="City">
            <input
              value={input.location}
              onChange={(event) => update("location", event.target.value)}
              className={fieldClass}
            />
          </Field>
          <Field label="Years of experience">
            <input
              type="number"
              min={0}
              max={50}
              value={input.experienceYears}
              onChange={(event) => update("experienceYears", Number(event.target.value))}
              className={fieldClass}
            />
          </Field>
          <Field label="Rating">
            <select
              value={input.rating}
              onChange={(event) => update("rating", Number(event.target.value))}
              className={fieldClass}
            >
              {[1, 2, 3, 4, 5].map((rating) => (
                <option key={rating} value={rating}>
                  {rating} / 5
                </option>
              ))}
            </select>
          </Field>
          <Field label="Skills" className="sm:col-span-2">
            <input
              data-testid="field-skills"
              value={skillsText}
              onChange={(event) => setSkillsText(event.target.value)}
              placeholder="SQL, Python, stakeholder calls"
              className={fieldClass}
            />
          </Field>
        </div>

        {error ? (
          <p role="alert" className="mt-3 text-sm text-clay">
            {error}
          </p>
        ) : (
          <p className="mt-3 text-sm text-muted">New people start in Applied.</p>
        )}

        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={closeForm} className="rounded-full px-4 py-2 text-sm">
            Cancel
          </button>
          <button
            type="submit"
            data-testid="save-candidate"
            className="rounded-full bg-brass px-4 py-2 text-sm text-white"
          >
            {form.mode === "edit" ? "Save changes" : "Add to desk"}
          </button>
        </div>
      </form>
    </div>
  );
}

const fieldClass =
  "w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-brass";

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-faint">{label}</span>
      {children}
    </label>
  );
}
