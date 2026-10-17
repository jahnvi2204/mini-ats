import type { Metadata } from "next";
import { DashboardView } from "@/components/DashboardView";

export const metadata: Metadata = {
  title: "Overview",
};

export default function HomePage() {
  return <DashboardView />;
}
