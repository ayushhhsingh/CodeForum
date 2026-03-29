import Answers from "@/components/Answers";
import Comments from "@/components/comment";
import QuestionEditButton from "@/components/QuestionEditButton";
import { MarkdownPreview } from "@/components/RTE";
import VoteButtons from "@/components/VoteButton";
import {
  getAppwriteErrorMessage,
  isPausedProjectError,
} from "@/lib/appwrite-error";
import { listCommentsSafe, listVotesSafe, toPlain } from "@/lib/appwrite-documents";
import { storage as clientStorage } from "@/models/client/config";
import { answerCollection, db, questionAttachmentBucket, questionCollection } from "@/models/name";
import { databases, users } from "@/models/server/config";
import convertDateToRelativeTime from "@/utils/relativeTime";
import slugify from "@/utils/slugify";
import { Query } from "node-appwrite";
import Link from "next/link";
import Search from "./search";

async function getQuestionWithRetry(questionId: string) {
  const retryDelays = [0, 250, 750];
  let lastError: unknown;

  for (const delay of retryDelays) {
    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    try {
      return await databases.getDocument(db, questionCollection, questionId);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

async function enrichComments(type: "question" | "answer", typeId: string) {
  const comments = await listCommentsSafe(type, typeId);

  comments.documents = await Promise.all(
    comments.documents.map(async (comment) => {
      const author = await users.get(comment.authorId);

      return {
        ...comment,
        author: {
          $id: author.$id,
          name: author.name,
        },
      };
    })
  );

  return toPlain(comments);
}

export default async function QuestionPage({
  params,
}: {
  params: Promise<{ quesid: string; quesName: string }>;
}) {
  const { quesid } = await params;

  try {
    const question = toPlain(await getQuestionWithRetry(quesid));

    const [author, upvotes, downvotes, comments, answers] = await Promise.all([
      users.get(question.authorId),
      listVotesSafe("question", quesid, "upvoted"),
      listVotesSafe("question", quesid, "downvoted"),
      enrichComments("question", quesid),
      databases.listDocuments(db, answerCollection, [
        Query.equal("questionId", quesid),
        Query.orderDesc("$createdAt"),
        Query.limit(100),
      ]),
    ]);

    const plainAnswers = toPlain(answers);
    plainAnswers.documents = await Promise.all(
      plainAnswers.documents.map(async (answer) => {
        const [answerAuthor, answerUpvotes, answerDownvotes, answerComments] =
          await Promise.all([
            users.get(answer.authorId),
            listVotesSafe("answer", answer.$id, "upvoted"),
            listVotesSafe("answer", answer.$id, "downvoted"),
            enrichComments("answer", answer.$id),
          ]);

        return {
          ...answer,
          author: {
            $id: answerAuthor.$id,
            name: answerAuthor.name,
            reputation: answerAuthor.prefs?.reputation ?? 0,
          },
          upvotesDocuments: answerUpvotes,
          downvotesDocuments: answerDownvotes,
          comments: answerComments,
        };
      })
    );

    return (
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-28">
        <div className="mb-8">
          <Search />
        </div>
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">{question.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/60">
              <p>
                Asked by{" "}
                <Link
                  href={`/users/${author.$id}/${slugify(author.name)}`}
                  className="text-orange-500 hover:text-orange-600"
                >
                  {author.name}
                </Link>
              </p>
              <time
                dateTime={question.$createdAt}
                title={new Date(question.$createdAt).toLocaleString()}
              >
                Asked {convertDateToRelativeTime(new Date(question.$createdAt))}
              </time>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-3">
            <QuestionEditButton
              questionId={question.$id}
              questionSlug={slugify(question.title)}
              authorId={question.authorId}
            />
            <Link
              href="/questions/ask"
              className="rounded-full bg-orange-500 px-5 py-2.5 font-medium text-white transition hover:bg-orange-600"
            >
              Ask Question
            </Link>
          </div>
        </div>

        <div className="flex gap-4">
          <VoteButtons
            type="question"
            id={question.$id}
            upvotes={upvotes}
            downvotes={downvotes}
            className="pt-4"
          />
          <div className="min-w-0 flex-1">
            {question.attachmentId ? (
              <div className="mb-4 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-2">
                <img
                  src={clientStorage.getFileView(questionAttachmentBucket, question.attachmentId).href}
                  alt={question.title}
                  className="max-h-[28rem] w-full rounded-xl object-contain"
                />
              </div>
            ) : null}
            <MarkdownPreview source={question.content} className="rounded-xl p-4" />
            <div className="mt-4 flex flex-wrap gap-2">
              {question.tags?.map((tag: string) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/80"
                >
                  #{tag}
                </span>
              ))}
            </div>
            <Comments comments={comments} className="mt-6" type="question" typeId={question.$id} />
          </div>
        </div>

        <section className="mt-10">
          <Answers answers={toPlain(plainAnswers)} questionId={question.$id} />
        </section>
      </main>
    );
  } catch (error) {
    if (isPausedProjectError(error)) {
      return (
        <main className="mx-auto max-w-4xl px-4 pb-20 pt-28">
          <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-6">
            <h1 className="text-2xl font-semibold">Question Unavailable</h1>
            <p className="mt-2 text-sm text-white/80">
              This question cannot be loaded because the Appwrite project is paused.
              Restore it in the Appwrite console to view asked questions again.
            </p>
          </div>
        </main>
      );
    }

    const message = getAppwriteErrorMessage(error);
    const looksMissing =
      /document with the requested id could not be found|not found/i.test(message);

    return (
      <main className="mx-auto max-w-4xl px-4 pb-20 pt-28">
        <div
          className={`rounded-2xl p-6 ${
            looksMissing
              ? "border border-amber-500/40 bg-amber-500/10"
              : "border border-red-500/40 bg-red-500/10"
          }`}
        >
          <h1 className="text-2xl font-semibold">Question Unavailable</h1>
          <p className="mt-2 text-sm text-white/80">
            {looksMissing
              ? "The question link was created, but the question could not be loaded yet. This usually means the document was not saved correctly or is not available from Appwrite yet."
              : message}
          </p>
          <div className="mt-4 flex gap-3">
            <Link
              href="/questions"
              className="rounded-full border border-current px-4 py-2 text-sm font-medium transition hover:bg-white/10"
            >
              Back to Questions
            </Link>
            <Link
              href="/questions/ask"
              className="rounded-full bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
            >
              Ask Again
            </Link>
          </div>
        </div>
      </main>
    );
  }
}
