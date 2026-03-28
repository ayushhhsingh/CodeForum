import QuestionForm from "@/components/QuestionForm";
import { getAppwriteErrorMessage, isPausedProjectError } from "@/lib/appwrite-error";
import { toPlain } from "@/lib/appwrite-documents";
import { db, questionCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import Link from "next/link";

export default async function EditQuestionPage({
    params,
}: {
    params: Promise<{ quesid: string; quesName: string }>;
}) {
    const { quesid } = await params;
    let question = null;
    let message = "";

    try {
        question = toPlain(await databases.getDocument(db, questionCollection, quesid));
    } catch (error) {
        message = isPausedProjectError(error)
            ? "This question cannot be edited because the Appwrite project is paused."
            : getAppwriteErrorMessage(error);
    }

    if (!question) {
        return (
            <main className="mx-auto max-w-4xl px-4 pb-20 pt-28">
                <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-6">
                    <h1 className="text-2xl font-semibold">Question Unavailable</h1>
                    <p className="mt-2 text-sm text-white/80">{message}</p>
                    <div className="mt-4">
                        <Link
                            href="/questions"
                            className="rounded-full border border-current px-4 py-2 text-sm font-medium transition hover:bg-white/10"
                        >
                            Back to Questions
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-4xl px-4 pb-20 pt-28">
            <div className="mb-8">
                <h1 className="text-3xl font-semibold">Edit Question</h1>
                <p className="mt-2 text-white/60">
                    Update your title, details, image, or tags and save the changes.
                </p>
            </div>
            <QuestionForm question={question} />
        </main>
    );
}
