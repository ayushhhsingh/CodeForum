import Pagination from "@/components/pagination";
import QuestionCard from "@/components/QuestionCard";
import { getAppwriteErrorMessage, isPausedProjectError } from "@/lib/appwrite-error";
import { listVotesSafe, toPlain } from "@/lib/appwrite-documents";
import { answerCollection, db, questionCollection } from "@/models/name";
import { databases, users } from "@/models/server/config";
import type { UserPrefs } from "@/models/user";
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

    const questions = toPlain(
      await databases.listDocuments(db, questionCollection, queries)
    );

    questions.documents = await Promise.all(
      questions.documents.map(async (ques) => {
        const [author, answers, votes] = await Promise.all([
          users.get<UserPrefs>(ques.authorId),
          databases.listDocuments(db, answerCollection, [
            Query.equal("questionId", ques.$id),
            Query.limit(1),
          ]),
          listVotesSafe("question", ques.$id),
        ]);

        return {
          ...ques,
          totalAnswers: answers.total,
          totalVotes: votes.total,
          author: {
            $id: author.$id,
            reputation: author.prefs.reputation,
            name: author.name,
          },
        };
      })
    );

    return (
      <div className="px-4">
        <div className="mb-4">
          <p>{questions.total} questions</p>
        </div>
        <div className="mb-4 max-w-3xl space-y-6">
          {questions.documents.map((ques) => (
            <QuestionCard key={ques.$id} ques={ques} />
          ))}
        </div>
        <Pagination total={questions.total} limit={25} />
      </div>
    );
  } catch (error) {
    const message = isPausedProjectError(error)
      ? "This user's questions are unavailable because the Appwrite project is paused."
      : getAppwriteErrorMessage(error);

    return (
      <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-6">
        <h2 className="text-xl font-semibold">Questions Unavailable</h2>
        <p className="mt-2 text-sm text-white/80">{message}</p>
      </div>
    );
  }
};

export default Page;
