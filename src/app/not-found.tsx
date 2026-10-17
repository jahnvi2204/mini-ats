import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-16">
      <p className="text-xs uppercase tracking-[0.16em] text-brass">Missing</p>
      <h1 className="mt-2 font-display text-5xl tracking-tight">That page is not on the desk</h1>
      <Link href="/" className="mt-6 inline-block text-sm text-forest underline-offset-2 hover:underline">
        Back to overview
      </Link>
    </div>
  );
}
