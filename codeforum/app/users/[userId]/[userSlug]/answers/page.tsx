import Pagination from "@/components/pagination";
import { MarkdownPreview } from "@/components/RTE";
import { getAppwriteErrorMessage, isPausedProjectError } from "@/lib/appwrite-error";
import { toPlain } from "@/lib/appwrite-documents";
import { answerCollection, db, questionCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import slugify from "@/utils/slugify";
import Link from "next/link";
import { Query } from "node-appwrite";
import React from "react";

const Page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string; userSlug: string }>;
  searchParams: Promise<{ page?: string }>;
}) => {
  const [{ userId }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const page = resolvedSearchParams.page || "1";

  try {
    const queries = [
      Query.equal("authorId", userId),
      Query.orderDesc("$createdAt"),
      Query.offset((+page - 1) * 25),
      Query.limit(25),
    ];

    const answers = toPlain(await databases.listDocuments(db, answerCollection, queries));

    answers.documents = await Promise.all(
      answers.documents.map(async (ans) => {
        const question = await databases.getDocument(db, questionCollection, ans.questionId, [
          Query.select(["title"]),
        ]);
        return { ...ans, question: toPlain(question) };
      })
    );

    return (
      <div className="px-4">
        <div className="mb-4">
          <p>{answers.total} answers</p>
        </div>
        <div className="mb-4 max-w-3xl space-y-6">
          {answers.documents.map((ans) => (
            <div key={ans.$id}>
              <div className="max-h-40 overflow-auto">
                <MarkdownPreview source={ans.content} className="rounded-lg p-4" />
              </div>
              <Link
                href={`/questions/${ans.questionId}/${slugify(ans.question.title)}`}
                className="mt-3 inline-block shrink-0 rounded bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-600"
              >
                Question
              </Link>
            </div>
          ))}
        </div>
        <Pagination total={answers.total} limit={25} />
      </div>
    );
  } catch (error) {
    const message = isPausedProjectError(error)
      ? "This user's answers are unavailable because the Appwrite project is paused."
      : getAppwriteErrorMessage(error);

    return (
      <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-6">
        <h2 className="text-xl font-semibold">Answers Unavailable</h2>
        <p className="mt-2 text-sm text-white/80">{message}</p>
      </div>
    );
  }
};

export default Page;
