"use client";

import { Models } from "appwrite";
import React from "react";
import VoteButtons from "./VoteButton";
import { useAuthStore } from "@/store/auth";
import RTE, { MarkdownPreview } from "./RTE";
import Comments, { type CommentView } from "./comment";
import slugify from "@/utils/slugify";
import Link from "next/link";
import { IconTrash } from "@tabler/icons-react";

export type AuthorView = {
    $id: string;
    name: string;
    reputation: number;
};

export type AnswerView = Models.Document & {
    authorId: string;
    content: string;
    author: AuthorView;
    upvotesDocuments: Models.DocumentList<Models.Document>;
    downvotesDocuments: Models.DocumentList<Models.Document>;
    comments: Models.DocumentList<CommentView>;
};

function getInitials(name: string) {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(part => part.charAt(0).toUpperCase())
        .join("");
}

function getErrorMessage(error: unknown, fallback: string) {
    if (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
    ) {
        return error.message;
    }

    return fallback;
}

const Answers = ({
    answers: _answers,
    questionId,
}: {
    answers: Models.DocumentList<AnswerView>;
    questionId: string;
}) => {
    const [answers, setAnswers] = React.useState(_answers);
    const [newAnswer, setNewAnswer] = React.useState("");
    const { user } = useAuthStore();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newAnswer || !user) return;

        try {
            const response = await fetch("/api/answer", {
                method: "POST",
                body: JSON.stringify({
                    questionId: questionId,
                    answer: newAnswer,
                    authorId: user.$id,
                }),
            });

            const data = await response.json();

            if (!response.ok) throw data;

            setNewAnswer(() => "");
            setAnswers(prev => ({
                total: prev.total + 1,
                documents: [
                    {
                        ...data,
                        author: {
                            $id: user.$id,
                            name: user.name,
                            reputation: Number(user.prefs?.reputation || 0),
                        },
                        upvotesDocuments: { documents: [], total: 0 },
                        downvotesDocuments: { documents: [], total: 0 },
                        comments: { documents: [], total: 0 },
                    },
                    ...prev.documents,
                ],
            }));
        } catch (error: unknown) {
            window.alert(getErrorMessage(error, "Error creating answer"));
        }
    };

    const deleteAnswer = async (answerId: string) => {
        try {
            const response = await fetch("/api/answer", {
                method: "DELETE",
                body: JSON.stringify({
                    answerId: answerId,
                }),
            });

            const data = await response.json();

            if (!response.ok) throw data;

            setAnswers(prev => ({
                total: prev.total - 1,
                documents: prev.documents.filter(answer => answer.$id !== answerId),
            }));
        } catch (error: unknown) {
            window.alert(getErrorMessage(error, "Error deleting answer"));
        }
    };

    return (
        <>
            <h2 className="mb-4 text-xl">{answers.total} Answers</h2>
            {answers.documents.map(answer => (
                <div key={answer.$id} className="flex gap-4">
                    <div className="flex shrink-0 flex-col items-center gap-4">
                        <VoteButtons
                            type="answer"
                            id={answer.$id}
                            upvotes={answer.upvotesDocuments}
                            downvotes={answer.downvotesDocuments}
                        />
                        {user?.$id === answer.authorId ? (
                            <button
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-red-500 p-1 text-red-500 duration-200 hover:bg-red-500/10"
                                onClick={() => deleteAnswer(answer.$id)}
                            >
                                <IconTrash className="h-4 w-4" />
                            </button>
                        ) : null}
                    </div>
                    <div className="w-full overflow-auto">
                        <MarkdownPreview className="rounded-xl p-4" source={answer.content} />
                        <div className="mt-4 flex items-center justify-end gap-1">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-sm font-semibold text-white">
                                {getInitials(answer.author.name)}
                            </div>
                            <div className="block leading-tight">
                                <Link
                                    href={`/users/${answer.author.$id}/${slugify(answer.author.name)}`}
                                    className="text-orange-500 hover:text-orange-600"
                                >
                                    {answer.author.name}
                                </Link>
                                <p>
                                    <strong>{answer.author.reputation}</strong>
                                </p>
                            </div>
                        </div>
                        <Comments
                            comments={answer.comments}
                            className="mt-4"
                            type="answer"
                            typeId={answer.$id}
                        />
                        <hr className="my-4 border-white/40" />
                    </div>
                </div>
            ))}
            <hr className="my-4 border-white/40" />
            <form id="answer-form" onSubmit={handleSubmit} className="space-y-2 scroll-mt-28">
                <h2 className="mb-4 text-xl">Your Answer</h2>
                <RTE
                    value={newAnswer || undefined}
                    onChange={value => setNewAnswer(() => value || "")}
                />
                <button className="shrink-0 rounded bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-600">
                    Post Your Answer
                </button>
            </form>
        </>
    );
};

export default Answers;
