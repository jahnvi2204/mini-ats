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
        actions={
          <a
            href={`${base}/demo.webm`}
            download="harbor-demo.webm"
            className="rounded-full bg-brass px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(31,111,235,0.28)] hover:bg-[#1859c4]"
          >
            Download demo
          </a>
        }
      />
      <video
        controls
        playsInline
        preload="metadata"
        className="w-full rounded-2xl border border-line bg-wash shadow-[0_10px_30px_rgba(18,51,82,0.05)]"
        src={`${base}/demo.webm`}
      >
        Your browser cannot play this video.{" "}
        <a href={`${base}/demo.webm`} download="harbor-demo.webm">
          Download the demo
        </a>
        .
      </video>
    </div>
  );
}
