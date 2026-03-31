import QuestionCard, { type QuestionCardData } from "@/components/QuestionCard";
import {
    getAppwriteErrorMessage,
    isPausedProjectError,
} from "@/lib/appwrite-error";
import { listVotesSafe } from "@/lib/appwrite-documents";
import { answerCollection, db, questionCollection } from "@/models/name";
import { databases, users } from "@/models/server/config";
import type { UserPrefs } from "@/models/user";
import { unstable_noStore as noStore } from "next/cache";
import { Models, Query } from "node-appwrite";
import React from "react";

type QuestionDocument = Models.Document & {
    authorId: string;
    title: string;
    content?: string;
    tags: string[];
    attachmentId?: string;
};

const LatestQuestions = async () => {
    noStore();
    let questions: Models.DocumentList<QuestionDocument> | null = null;
    let message = "";

    try {
        questions = await databases.listDocuments<QuestionDocument>(db, questionCollection, [
            Query.limit(5),
            Query.orderDesc("$createdAt"),
        ]);

        questions.documents = await Promise.all<QuestionCardData>(
            questions.documents.map(async ques => {
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
    } catch (error) {
        message = isPausedProjectError(error)
            ? "Questions are unavailable because the Appwrite project is paused. Restore it in the Appwrite console to load asked questions."
            : getAppwriteErrorMessage(error);
    }

    if (!questions) {
        return (
            <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-6">
                <h2 className="text-xl font-semibold">Questions Unavailable</h2>
                <p className="mt-2 text-sm text-white/80">{message}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {questions.documents.map(question => (
                <QuestionCard key={question.$id} ques={question as QuestionCardData} />
            ))}
        </div>
    );
};

export default LatestQuestions;
