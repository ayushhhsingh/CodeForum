import LatestQuestions from "@/app/components/latestQuestion";
import AnimatedGridPattern from "@/components/magicui/animated-grid-pattern";
import RetroGrid from "@/components/magicui/retro-grid";
import { cn } from "@/utils/cn";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function QuestionsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_30%),radial-gradient(circle_at_20%_30%,rgba(249,115,22,0.12),transparent_22%)]" />
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.15}
        duration={3}
        repeatDelay={1}
        className={cn(
          "absolute inset-0 opacity-40",
          "[mask-image:radial-gradient(900px_circle_at_center,white,transparent)]"
        )}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[38vh] overflow-hidden">
        <RetroGrid className="absolute inset-x-0 bottom-[-20%] h-[160%] opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
      </div>
      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-32 pt-28">
        <div className="mb-10 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-orange-500">
              Community Board
            </p>
            <h1 className="mt-3 text-4xl font-semibold">All Questions</h1>
            <p className="mt-2 max-w-2xl text-white/60">
              Browse the latest questions from the community.
            </p>
          </div>
          <Link
            href="/questions/ask"
            className="rounded-full border border-white/10 bg-white/5 px-6 py-3 font-medium text-white shadow-[0_0_30px_rgba(255,255,255,0.08)] transition hover:bg-white/10"
          >
            Ask Question
          </Link>
        </div>
        <LatestQuestions />
      </div>
    </main>
  );
}
