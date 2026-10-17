"use client";

import { stageBarClass, stagePillClass, PageHeader } from "@/components/ui";
import { STAGE_META } from "@/lib/stages";
import { useDesk } from "@/lib/store";
import { STAGES } from "@/lib/types";

export function RolesView() {
  const { jobs, candidates, openCandidate } = useDesk();

  return (
    <div data-testid="roles">
      <PageHeader
        kicker="Openings"
        title="Roles"
        lede="Each candidate belongs to a role. Closed roles stay on the desk so hired people keep their history."
      />

      <div className="space-y-4">
        {jobs.map((job) => {
          const people = candidates.filter((candidate) => candidate.jobId === job.id);
          const hired = people.filter((candidate) => candidate.stage === "hired").length;
          return (
            <article key={job.id} className="rounded-2xl border border-line bg-raised p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-3xl tracking-tight">{job.title}</h2>
                  <p className="mt-1 text-sm text-muted">
                    {job.department} · {job.location} · {job.type}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span
                    className={`rounded-full px-2.5 py-1 ${
                      job.status === "open" ? "bg-forest-soft text-forest" : "bg-[#efeae1] text-muted"
                    }`}
                  >
                    {job.status === "open" ? "Open" : "Closed"}
                  </span>
                  <span className="text-muted">
                    {job.openings} {job.openings === 1 ? "seat" : "seats"} · {hired} hired ·{" "}
                    {people.length} in roster
                  </span>
                </div>
              </div>

              <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-[#efe8db]">
                {STAGES.map((stage) => {
                  const count = people.filter((candidate) => candidate.stage === stage).length;
                  if (count === 0 || people.length === 0) return null;
                  return (
                    <div
                      key={stage}
                      className={stageBarClass(stage)}
                      style={{ width: `${(count / people.length) * 100}%` }}
                      title={`${STAGE_META[stage].label}: ${count}`}
                    />
                  );
                })}
              </div>

              {people.length === 0 ? (
                <p className="mt-4 text-sm text-muted">No candidates on this role yet.</p>
              ) : (
                <ul className="mt-4 divide-y divide-line">
                  {people.map((candidate) => (
                    <li key={candidate.id} className="flex items-center justify-between gap-3 py-2.5">
                      <button
                        type="button"
                        onClick={() => openCandidate(candidate.id)}
                        className="text-left"
                      >
                        <span className="block font-medium">{candidate.name}</span>
                        <span className="block text-xs text-faint">
                          {candidate.location} · {candidate.source}
                        </span>
                      </button>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${stagePillClass(candidate.stage)}`}
                      >
                        {STAGE_META[candidate.stage].label}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
