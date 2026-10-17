import type { Metadata } from "next";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Demo",
};

export default function DemoPage() {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    <div>
      <PageHeader
        kicker="Walkthrough"
        title="Demo"
        lede="A short pass through the overview, a stage change, search, a new candidate, and the roles."
      />
      <video
        controls
        playsInline
        preload="metadata"
        className="w-full rounded-2xl border border-line bg-ink"
        src={`${base}/demo.webm`}
      >
        Your browser cannot play this video. Download it from the same address.
      </video>
    </div>
  );
}
