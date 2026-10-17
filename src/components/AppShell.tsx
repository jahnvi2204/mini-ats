"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { CandidateDrawer } from "@/components/CandidateDrawer";
import { CandidateForm } from "@/components/CandidateForm";
import { useDesk } from "@/lib/store";

const NAV = [
  { href: "/", label: "Overview", testId: "nav-overview" },
  { href: "/pipeline", label: "Pipeline", testId: "nav-pipeline" },
  { href: "/candidates", label: "Candidates", testId: "nav-candidates" },
  { href: "/roles", label: "Roles", testId: "nav-roles" },
  { href: "/demo", label: "Demo", testId: "nav-demo" },
];

function isActive(pathname: string, href: string) {
  const current = pathname.replace(/\/$/, "") || "/";
  const target = href.replace(/\/$/, "") || "/";
  return current === target;
}

export function BootScreen() {
  return (
    <div className="grid min-h-screen place-items-center bg-paper text-ink">
      <div className="text-center">
        <p className="font-display text-5xl tracking-tight">Harbor</p>
        <p className="mt-2 text-sm text-muted">Opening the hiring desk</p>
      </div>
    </div>
  );
}

function Wordmark() {
  return (
    <Link href="/" className="block px-3">
      <span className="font-display text-3xl tracking-tight text-rail-text">Harbor</span>
      <span className="mt-1 block text-xs uppercase tracking-[0.16em] text-rail-muted">
        Applicant tracking
      </span>
    </Link>
  );
}

function NavLinks({ tone }: { tone: "rail" | "paper" }) {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 md:flex-col" aria-label="Primary">
      {NAV.map((item) => {
        const active = isActive(pathname, item.href);
        const className =
          tone === "rail"
            ? active
              ? "bg-rail-2 text-rail-text"
              : "text-rail-muted hover:bg-white/5 hover:text-rail-text"
            : active
              ? "bg-ink text-paper"
              : "text-muted hover:bg-white";
        return (
          <Link
            key={item.href}
            href={item.href}
            data-testid={item.testId}
            aria-current={active ? "page" : undefined}
            className={`shrink-0 rounded-lg px-3 py-2 text-sm whitespace-nowrap transition-colors ${className}`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { ready, openCreate, toast, reset } = useDesk();
  const pathname = usePathname();

  useEffect(() => {
    const path = pathname.replace(/\/$/, "") || "/";
    const titles: Record<string, string> = {
      "/": "Overview · Harbor",
      "/pipeline": "Pipeline · Harbor",
      "/candidates": "Candidates · Harbor",
      "/roles": "Roles · Harbor",
      "/demo": "Demo · Harbor",
    };
    document.title = titles[path] ?? "Harbor";
  }, [pathname]);

  if (!ready) return <BootScreen />;

  return (
    <div className="min-h-screen bg-paper text-ink">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col border-r border-black/40 bg-rail text-rail-text md:flex">
        <div className="px-3 pt-7">
          <Wordmark />
          <p className="mt-5 px-3 text-sm leading-5 text-rail-muted">
            Candidates, stages, and the numbers that show where hiring is stuck.
          </p>
        </div>
        <div className="mt-6 px-3">
          <NavLinks tone="rail" />
        </div>
        <div className="mt-auto space-y-3 px-5 pb-6">
          <button
            type="button"
            data-testid="add-candidate"
            onClick={openCreate}
            className="w-full rounded-full bg-brass px-4 py-2.5 text-sm font-semibold text-[#1c1408] hover:bg-[#d7a45a]"
          >
            Add candidate
          </button>
          <p className="text-xs leading-5 text-rail-muted">
            Changes stay in this browser.
          </p>
          <button
            type="button"
            data-testid="reset-desk"
            onClick={() => {
              if (
                window.confirm(
                  "Restore the sample desk? Changes saved in this browser will be replaced.",
                )
              ) {
                reset();
              }
            }}
            className="text-xs text-rail-muted underline-offset-2 hover:text-rail-text hover:underline"
          >
            Reset sample data
          </button>
        </div>
      </aside>

      <div className="md:pl-60">
        <div className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur md:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <Link href="/" className="font-display text-2xl">
              Harbor
            </Link>
            <button
              type="button"
              onClick={openCreate}
              className="rounded-full bg-ink px-3 py-1.5 text-sm text-paper"
            >
              Add candidate
            </button>
          </div>
          <div className="overflow-x-auto px-3 pb-3">
            <NavLinks tone="paper" />
          </div>
        </div>
        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-10">{children}</main>
      </div>

      <CandidateDrawer />
      <CandidateForm />

      {toast ? (
        <div
          role="status"
          data-testid="toast"
          className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full border border-line bg-ink px-4 py-2 text-sm text-rail-text shadow-lg"
        >
          {toast}
        </div>
      ) : null}
    </div>
  );
}
