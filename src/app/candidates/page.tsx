import type { Metadata } from "next";
import { CandidatesView } from "@/components/CandidatesView";

export const metadata: Metadata = {
  title: "Candidates",
};

export default function CandidatesPage() {
  return <CandidatesView />;
}
