import type { Metadata } from "next";
import { Figtree, Fraunces } from "next/font/google";
import { AppShell } from "@/components/AppShell";
import { DeskProvider } from "@/lib/store";
import "./globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  title: {
    default: "Harbor",
    template: "%s · Harbor",
  },
  description:
    "Harbor is a mini applicant tracking system for candidates, hiring stages, search, and dashboard metrics.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${figtree.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        <DeskProvider>
          <AppShell>{children}</AppShell>
        </DeskProvider>
      </body>
    </html>
  );
}
