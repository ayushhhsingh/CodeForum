import QuestionForm from "@/components/QuestionForm";

export default function AskQuestionPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 pb-20 pt-28">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Ask a Question</h1>
        <p className="mt-2 text-white/60">
          Share the problem clearly so others can help you faster.
        </p>
      </div>
      <QuestionForm />
    </main>
  );
}
