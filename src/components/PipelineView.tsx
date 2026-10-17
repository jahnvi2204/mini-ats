"use client";

import { useEffect, useState } from "react";
import { PageHeader, stageDotClass } from "@/components/ui";
import { formatDays } from "@/lib/format";
import { daysInStage, jobTitle } from "@/lib/people";
import { STAGE_META } from "@/lib/stages";
import { useDesk } from "@/lib/store";
import { STAGES, type Stage } from "@/lib/types";

export function PipelineView() {
  const { jobs, candidates, moveStage, openCandidate } = useDesk();
  const [over, setOver] = useState<Stage | null>(null);

  useEffect(() => {
    const clear = () => setOver(null);
    window.addEventListener("dragend", clear);
    return () => window.removeEventListener("dragend", clear);
  }, []);

  return (
    <div data-testid="pipeline">
      <PageHeader
        kicker="Stages"
        title="Pipeline"
        lede="Drag someone into another stage, or use the move menu on a card. Hired and rejected close the loop."
      />

      <div className="flex gap-3 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const people = candidates.filter((candidate) => candidate.stage === stage);
          const activeDrop = over === stage;
          return (
            <section
              key={stage}
              data-testid={`column-${stage}`}
              onDragOver={(event) => {
                event.preventDefault();
                setOver(stage);
              }}
              onDrop={(event) => {
                event.preventDefault();
                const id = event.dataTransfer.getData("text/plain");
                setOver(null);
                if (id) moveStage(id, stage);
              }}
              className={`flex w-72 shrink-0 flex-col rounded-2xl border bg-[#f7f3eb] p-3 ${
                activeDrop ? "border-brass bg-brass-soft" : "border-line"
              }`}
            >
              <header className="mb-3 flex items-start justify-between gap-2 px-1">
                <div>
                  <h2 className="flex items-center gap-2 text-sm font-semibold">
                    <span className={`h-2 w-2 rounded-full ${stageDotClass(stage)}`} />
                    {STAGE_META[stage].label}
                  </h2>
                  <p className="mt-1 text-xs text-muted">{STAGE_META[stage].hint}</p>
                </div>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs text-muted">
                  {people.length}
                </span>
              </header>
              <div className="flex min-h-48 flex-col gap-2">
                {people.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-line-strong px-3 py-6 text-center text-xs text-faint">
                    No one here
                  </p>
                ) : (
                  people.map((candidate) => (
                    <article
                      key={candidate.id}
                      draggable
                      data-testid={`card-${candidate.id}`}
                      onDragStart={(event) => {
                        event.dataTransfer.setData("text/plain", candidate.id);
                        event.dataTransfer.effectAllowed = "move";
                      }}
                      className="cursor-grab rounded-xl border border-line bg-raised p-3 shadow-[0_1px_0_rgba(28,25,21,0.03)] active:cursor-grabbing"
                    >
                      <button
                        type="button"
                        onClick={() => openCandidate(candidate.id)}
                        className="w-full text-left"
                      >
                        <span className="block font-medium">{candidate.name}</span>
                        <span className="mt-1 block text-sm text-muted">
                          {jobTitle(jobs, candidate.jobId)}
                        </span>
                        <span className="mt-2 block text-xs text-faint">
                          {candidate.source} · {candidate.location} ·{" "}
                          {formatDays(daysInStage(candidate))}
                        </span>
                      </button>
                      <label className="mt-3 block">
                        <span className="sr-only">Move {candidate.name}</span>
                        <select
                          aria-label={`Move ${candidate.name}`}
                          value={candidate.stage}
                          onChange={(event) =>
                            moveStage(candidate.id, event.target.value as Stage)
                          }
                          className="w-full rounded-lg border border-line bg-paper px-2 py-1 text-xs"
                        >
                          {STAGES.map((option) => (
                            <option key={option} value={option}>
                              {STAGE_META[option].label}
                            </option>
                          ))}
                        </select>
                      </label>
                    </article>
                  ))
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
