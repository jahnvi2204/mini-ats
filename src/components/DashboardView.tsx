"use client";

import Link from "next/link";
import { formatCount, formatDate, formatDays, formatLongDate, formatPercent } from "@/lib/format";
import { buildMetrics } from "@/lib/metrics";
import { STAGE_META } from "@/lib/stages";
import { useDesk } from "@/lib/store";
import { PageHeader, Panel, stageBarClass, stagePillClass } from "@/components/ui";

export function DashboardView() {
  const { jobs, candidates, openCandidate } = useDesk();
  const metrics = buildMetrics(jobs, candidates);
  const widest = Math.max(...metrics.funnel.map((step) => step.reached), 1);
  const today = formatLongDate();

  return (
    <div data-testid="overview">
      <PageHeader
        kicker={today}
        title="Overview"
        lede="A live read on who is in process, which stage they reached, and who has been waiting."
      />

      <section
        data-testid="metrics"
        className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
        aria-label="Hiring metrics"
      >
        <Metric
          label="Candidates"
          value={formatCount(metrics.total)}
          detail={`Across ${formatCount(jobs.length)} roles`}
        />
        <Metric
          label="Active pipeline"
          value={formatCount(metrics.active)}
          detail="Not yet hired or rejected"
        />
        <Metric
          label="Hired"
          value={formatCount(metrics.hired)}
          detail={`${formatPercent(metrics.hireRate)} of decided candidates`}
        />
        <Metric
          label="Time to hire"
          value={formatDays(metrics.averageTimeToHire)}
          detail="Average from application to hire"
        />
        <Metric
          label="Open roles"
          value={formatCount(metrics.openRoles)}
          detail={`${formatCount(metrics.openSeats)} seats still open`}
          href="/roles"
        />
        <Metric
          label="Waiting now"
          value={formatDays(metrics.averageActiveWait)}
          detail="Average time in the current stage"
        />
      </section>

      <div className="mt-6 grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Panel
            title="Stage funnel"
            caption="People who reached each stage, including anyone who has since moved on. The percent is conversion from the previous stage."
          >
            <ol className="space-y-4" data-testid="funnel">
              {metrics.funnel.map((step) => (
                <li key={step.stage}>
                  <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
                    <span className="font-medium">{step.label}</span>
                    <span className="text-muted">
                      {step.reached} reached
                      {step.conversion === null
                        ? ""
                        : ` · ${formatPercent(step.conversion)} from prior`}
                      {` · ${step.current} here now`}
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-[#efe8db]">
                    <div
                      className={`h-full rounded-full ${stageBarClass(step.stage)}`}
                      style={{ width: `${Math.max(6, (step.reached / widest) * 100)}%` }}
                    />
                  </div>
                </li>
              ))}
            </ol>
          </Panel>
        </div>

        <div className="lg:col-span-2">
          <Panel
            title="Needs a nudge"
            caption="Active candidates waiting 10 days or more in the current stage."
          >
            {metrics.attention.length === 0 ? (
              <p className="text-sm text-muted">Nobody is stuck. The active pipeline is moving.</p>
            ) : (
              <ul className="divide-y divide-line" data-testid="attention-list">
                {metrics.attention.map((item) => (
                  <li key={item.candidate.id}>
                    <button
                      type="button"
                      data-testid="attention-item"
                      onClick={() => openCandidate(item.candidate.id)}
                      className="flex w-full items-start justify-between gap-3 py-3 text-left hover:text-forest"
                    >
                      <span>
                        <span className="block font-medium">{item.candidate.name}</span>
                        <span className="mt-0.5 block text-sm text-muted">
                          {item.role} · {STAGE_META[item.candidate.stage].label}
                        </span>
                      </span>
                      <span className="shrink-0 text-sm text-amber">
                        {formatDays(item.days)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel
          title="Time in stage"
          caption="How long the people currently in each stage have been sitting there."
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-[0.14em] text-faint">
                <th className="pb-2 font-medium">Stage</th>
                <th className="pb-2 font-medium">People</th>
                <th className="pb-2 text-right font-medium">Average wait</th>
              </tr>
            </thead>
            <tbody>
              {metrics.aging.map((row) => (
                <tr key={row.stage} className="border-t border-line">
                  <td className="py-2.5">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs ${stagePillClass(row.stage)}`}
                    >
                      {row.label}
                    </span>
                  </td>
                  <td className="py-2.5 text-muted">{row.count}</td>
                  <td className="py-2.5 text-right">{formatDays(row.averageDays)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel title="Sources" caption="Where the current roster came from.">
          <ul className="space-y-3" data-testid="sources">
            {metrics.sources.map((slice) => (
              <li key={slice.source}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{slice.source}</span>
                  <span className="text-muted">
                    {slice.count} ·{" "}
                    {formatPercent(
                      metrics.total === 0 ? null : (slice.count / metrics.total) * 100,
                    )}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#efe8db]">
                  <div
                    className="h-full rounded-full bg-brass"
                    style={{
                      width: `${metrics.total === 0 ? 0 : (slice.count / metrics.total) * 100}%`,
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-4">
        <Panel
          title="Recent movement"
          caption="Applications and stage changes, newest first."
          action={
            <Link href="/pipeline" className="text-sm text-forest underline-offset-2 hover:underline">
              Open pipeline
            </Link>
          }
        >
          <ul className="divide-y divide-line" data-testid="activity">
            {metrics.activity.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => openCandidate(item.candidateId)}
                  className="flex w-full items-baseline justify-between gap-3 py-3 text-left"
                >
                  <span>
                    <span className="font-medium">{item.name}</span>
                    <span className="text-muted"> {item.label.toLowerCase()}</span>
                    <span className="mt-0.5 block text-sm text-faint">{item.role}</span>
                  </span>
                  <span className="shrink-0 text-sm text-muted">{formatDate(item.at)}</span>
                </button>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  detail,
  href,
}: {
  label: string;
  value: string;
  detail: string;
  href?: string;
}) {
  const className =
    "block rounded-2xl border border-line bg-raised px-4 py-4 shadow-[0_1px_0_rgba(28,25,21,0.03)]";
  const body = (
    <>
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">{label}</p>
      <p className="mt-2 font-display text-4xl leading-none tracking-tight">{value}</p>
      <p className="mt-2 text-sm text-muted">{detail}</p>
    </>
  );
  if (href) {
    return (
      <Link href={href} className={`${className} hover:border-line-strong`}>
        {body}
      </Link>
    );
  }
  return <article className={className}>{body}</article>;
}
