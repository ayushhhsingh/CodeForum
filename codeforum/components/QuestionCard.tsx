"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Models } from "appwrite";
import slugify from "@/utils/slugify";
import convertDateToRelativeTime from "@/utils/relativeTime";
import QuestionEditButton from "@/components/QuestionEditButton";

type QuestionCardAuthor = {
    $id: string;
    name: string;
    reputation: number;
};

export type QuestionCardData = Models.Document & {
    authorId: string;
    title: string;
    content?: string;
    tags: string[];
    attachmentId?: string;
    totalVotes: number;
    totalAnswers: number;
    author: QuestionCardAuthor;
};

function getInitials(name: string) {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(part => part.charAt(0).toUpperCase())
        .join("");
}

const QuestionCard = ({ ques }: { ques: QuestionCardData }) => {
    return (
        <div
            className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0f]/95 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] duration-200 hover:bg-[#101016] sm:flex-row"
        >
            <motion.div
                className="pointer-events-none absolute inset-[-140%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_295deg,rgba(251,146,60,0.95)_325deg,rgba(168,85,247,0.95)_350deg,transparent_360deg)] opacity-80"
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />
            <div className="pointer-events-none absolute inset-px rounded-[15px] bg-[#0b0b0f]/95" />
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_38%)] opacity-70" />
            <div className="relative shrink-0 text-sm sm:text-right">
                <p>{ques.totalVotes} votes</p>
                <p>{ques.totalAnswers} answers</p>
            </div>
            <div className="relative w-full">
                <Link
                    href={`/questions/${ques.$id}/${slugify(ques.title)}`}
                    className="text-orange-500 duration-200 hover:text-orange-600"
                >
                    <h2 className="text-xl">{ques.title}</h2>
                </Link>
                {ques.content ? (
                    <p className="mt-3 whitespace-pre-line text-sm leading-6 text-white/75">
                        {ques.content}
                    </p>
                ) : null}
                {ques.attachmentId ? (
                    <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-2">
                        <img
                            src={`/api/question-attachment/${ques.attachmentId}`}
                            alt={ques.title}
                            className="max-h-72 w-full rounded-xl object-cover"
                        />
                    </div>
                ) : null}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Link
                        href={`/questions/${ques.$id}/${slugify(ques.title)}#answer-form`}
                        className="rounded-full border border-orange-500/40 bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-400 transition hover:bg-orange-500/20"
                    >
                        Reply
                    </Link>
                    <QuestionEditButton
                        questionId={ques.$id}
                        questionSlug={slugify(ques.title)}
                        authorId={ques.authorId}
                        className="px-3 py-1 text-xs"
                        label="Edit Question"
                    />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                    {ques.tags.map((tag: string) => (
                        <Link
                            key={tag}
                            href={`/questions?tag=${tag}`}
                            className="inline-block rounded-lg bg-white/10 px-2 py-0.5 duration-200 hover:bg-white/20"
                        >
                            #{tag}
                        </Link>
                    ))}
                    <div className="ml-auto flex items-center gap-1">
                        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/10 text-[10px] font-semibold text-white">
                            {getInitials(ques.author.name)}
                        </div>
                        <Link
                            href={`/users/${ques.author.$id}/${slugify(ques.author.name)}`}
                            className="text-orange-500 hover:text-orange-600"
                        >
                            {ques.author.name}
                        </Link>
                        <strong>&quot;{ques.author.reputation}&quot;</strong>
                    </div>
                    <span>asked {convertDateToRelativeTime(new Date(ques.$createdAt))}</span>
                </div>
            </div>
        </div>
    );
};

export default QuestionCard;
