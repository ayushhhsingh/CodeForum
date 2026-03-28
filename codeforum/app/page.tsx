import Footer from "./components/Footer";
import HeroSection from "./components/herosection";
import LatestQuestions from "./components/latestQuestion";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <main>
      <HeroSection />
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-orange-500">
            Fresh Discussions
          </p>
          <h2 className="mt-3 text-3xl font-semibold">Latest Questions</h2>
          <p className="mt-2 text-white/60">
            Live questions from the community, ready for answers.
          </p>
        </div>
        <LatestQuestions />
      </section>
      <Footer />
    </main>
  );
}
