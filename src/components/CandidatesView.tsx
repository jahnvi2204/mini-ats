"use client";

import { useMemo, useState } from "react";
import { PageHeader, stagePillClass } from "@/components/ui";
import { formatDate, formatDays } from "@/lib/format";
import {
  candidateSearchText,
  candidatesToCsv,
  daysInStage,
  jobTitle,
  sortCandidates,
  type CandidateSort,
} from "@/lib/people";
import { STAGE_META } from "@/lib/stages";
import { useDesk } from "@/lib/store";
import { SOURCES, STAGES, type Source, type Stage } from "@/lib/types";

export function CandidatesView() {
  const { jobs, candidates, openCandidate, openCreate } = useDesk();
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState<Stage | "all">("all");
  const [source, setSource] = useState<Source | "all">("all");
  const [jobId, setJobId] = useState("all");
  const [sort, setSort] = useState<CandidateSort>("recent");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const matched = candidates.filter((candidate) => {
      if (stage !== "all" && candidate.stage !== stage) return false;
      if (source !== "all" && candidate.source !== source) return false;
      if (jobId !== "all" && candidate.jobId !== jobId) return false;
      if (!needle) return true;
      return candidateSearchText(candidate, jobs).includes(needle);
    });
    return sortCandidates(matched, sort);
  }, [candidates, jobs, query, stage, source, jobId, sort]);

  const filtersActive = query.trim() !== "" || stage !== "all" || source !== "all" || jobId !== "all";

  function exportCsv() {
    const csv = candidatesToCsv(filtered, jobs);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "harbor-candidates.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div data-testid="candidates">
      <PageHeader
        kicker="Roster"
        title="Candidates"
        lede="Search by name, email, skill, city, or role. Filter the stage, source, and opening."
        actions={
          <>
            <button
              type="button"
              onClick={exportCsv}
              className="rounded-full border border-line-strong px-4 py-2 text-sm hover:bg-white"
            >
              Export CSV
            </button>
            <button
              type="button"
              onClick={openCreate}
              className="rounded-full bg-brass px-4 py-2 text-sm text-white"
            >
              Add candidate
            </button>
          </>
        }
      />

      <div className="rounded-2xl border border-line bg-raised p-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          <label className="xl:col-span-2">
            <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-faint">Search</span>
            <input
              data-testid="candidate-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Name, skill, email, role"
              className="w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-brass"
            />
          </label>
          <Select
            label="Stage"
            value={stage}
            testId="filter-stage"
            onChange={(value) => setStage(value as Stage | "all")}
            options={[
              ["all", "All stages"],
              ...STAGES.map((item) => [item, STAGE_META[item].label] as const),
            ]}
          />
          <Select
            label="Source"
            value={source}
            testId="filter-source"
            onChange={(value) => setSource(value as Source | "all")}
            options={[["all", "All sources"], ...SOURCES.map((item) => [item, item] as const)]}
          />
          <Select
            label="Role"
            value={jobId}
            testId="filter-role"
            onChange={setJobId}
            options={[["all", "All roles"], ...jobs.map((job) => [job.id, job.title] as const)]}
          />
          <Select
            label="Sort"
            value={sort}
            testId="filter-sort"
            onChange={(value) => setSort(value as CandidateSort)}
            options={[
              ["recent", "Newest applied"],
              ["name", "Name"],
              ["rating", "Highest rating"],
              ["waiting", "Longest wait"],
            ]}
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-sm text-muted">
          <p data-testid="result-count">
            {filtered.length} {filtered.length === 1 ? "candidate" : "candidates"}
          </p>
          {filtersActive ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setStage("all");
                setSource("all");
                setJobId("all");
              }}
              className="text-forest underline-offset-2 hover:underline"
            >
              Clear filters
            </button>
          ) : null}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-line-strong bg-raised px-6 py-16 text-center">
          <p className="font-display text-3xl">No one matches</p>
          <p className="mt-2 text-sm text-muted">
            Try a broader search, or clear the stage and source filters.
          </p>
        </div>
      ) : (
        <>
          <ul className="mt-4 space-y-3 md:hidden">
            {filtered.map((candidate) => (
              <li key={candidate.id}>
                <button
                  type="button"
                  onClick={() => openCandidate(candidate.id)}
                  className="w-full rounded-2xl border border-line bg-raised p-4 text-left"
                >
                  <span className="flex items-start justify-between gap-3">
                    <span>
                      <span className="block font-medium">{candidate.name}</span>
                      <span className="mt-1 block text-sm text-muted">
                        {jobTitle(jobs, candidate.jobId)}
                      </span>
                    </span>
                    <StageBadge stage={candidate.stage} />
                  </span>
                  <span className="mt-3 block text-sm text-muted">
                    {candidate.source} · waiting {formatDays(daysInStage(candidate))}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-4 hidden overflow-hidden rounded-2xl border border-line bg-raised md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-wash text-xs uppercase tracking-[0.14em] text-faint">
                <tr>
                  <th className="px-4 py-3 font-medium">Candidate</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Stage</th>
                  <th className="px-4 py-3 font-medium">Source</th>
                  <th className="px-4 py-3 font-medium">Applied</th>
                  <th className="px-4 py-3 font-medium">Waiting</th>
                  <th className="px-4 py-3 font-medium">Rating</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((candidate) => (
                  <tr key={candidate.id} className="border-t border-line hover:bg-paper">
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        data-testid="candidate-row"
                        onClick={() => openCandidate(candidate.id)}
                        className="text-left"
                      >
                        <span className="block font-medium">{candidate.name}</span>
                        <span className="block text-xs text-faint">{candidate.email}</span>
                      </button>
                    </td>
                    <td className="px-4 py-3">{jobTitle(jobs, candidate.jobId)}</td>
                    <td className="px-4 py-3">
                      <StageBadge stage={candidate.stage} />
                    </td>
                    <td className="px-4 py-3 text-muted">{candidate.source}</td>
                    <td className="px-4 py-3 text-muted">{formatDate(candidate.appliedAt)}</td>
                    <td className="px-4 py-3">{formatDays(daysInStage(candidate))}</td>
                    <td className="px-4 py-3 text-muted">{candidate.rating}/5</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function StageBadge({ stage }: { stage: Stage }) {
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ${stagePillClass(stage)}`}>
      {STAGE_META[stage].label}
    </span>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
  testId,
}: {
  label: string;
  value: string;
  options: readonly (readonly [string, string])[];
  onChange: (value: string) => void;
  testId: string;
}) {
  return (
    <label>
      <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-faint">{label}</span>
      <select
        data-testid={testId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-brass"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}
