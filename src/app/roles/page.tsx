import type { Metadata } from "next";
import { RolesView } from "@/components/RolesView";

export const metadata: Metadata = {
  title: "Roles",
};

export default function RolesPage() {
  return <RolesView />;
}
