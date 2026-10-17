import type { Stage } from "@/lib/types";

const TONE: Record<Stage, string> = {
  applied: "bg-[#efeae1] text-[#4f483f]",
  screening: "bg-sea-soft text-sea",
  interview: "bg-forest-soft text-forest",
  offer: "bg-amber-soft text-amber",
  hired: "bg-forest text-[#f7f4ee]",
  rejected: "bg-clay-soft text-clay",
};

const DOT: Record<Stage, string> = {
  applied: "bg-[#8d8478]",
  screening: "bg-sea",
  interview: "bg-forest",
  offer: "bg-amber",
  hired: "bg-forest",
  rejected: "bg-clay",
};

export function stagePillClass(stage: Stage) {
  return TONE[stage];
}

export function stageDotClass(stage: Stage) {
  return DOT[stage];
}

export function stageBarClass(stage: Stage) {
  return DOT[stage];
}

export function PageHeader({
  kicker,
  title,
  lede,
  actions,
}: {
  kicker: string;
  title: string;
  lede?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brass">
          {kicker}
        </p>
        <h1 className="mt-1 font-display text-4xl tracking-tight text-ink sm:text-5xl">
          {title}
        </h1>
        {lede ? <p className="mt-3 text-base leading-6 text-muted">{lede}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export function Panel({
  title,
  caption,
  children,
  action,
}: {
  title: string;
  caption?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-line bg-raised p-5 shadow-[0_1px_0_rgba(28,25,21,0.03)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl tracking-tight">{title}</h2>
          {caption ? <p className="mt-1 text-sm leading-5 text-muted">{caption}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
