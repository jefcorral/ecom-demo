import Link from "next/link";
import { Flower2 } from "lucide-react";

export function AuthCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-10 sm:py-16">
      <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-secondary-container/60 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <section className="relative w-full max-w-[440px] rounded-lg bg-surface-container-lowest p-6 shadow-md motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 sm:p-8" aria-labelledby="auth-title">
        <Link href="/" className="mx-auto mb-6 flex w-fit items-center gap-2 text-primary">
          <Flower2 className="h-6 w-6" />
          <span className="font-serif text-xl font-semibold">Bloom &amp; Stem</span>
        </Link>
        <div className="mb-6 text-center">
          <h1 id="auth-title" className="font-serif text-[28px] font-semibold leading-[1.3] text-on-surface sm:text-[32px]">{title}</h1>
          <p className="mt-2 text-base leading-relaxed text-on-surface-variant sm:text-lg">{description}</p>
        </div>
        {children}
      </section>
    </div>
  );
}
