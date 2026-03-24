"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Models } from "appwrite";
import slugify from "@/utils/slugify";
import { avatars } from "@/models/client/config";
import convertDateToRelativeTime from "@/utils/relativeTime";
import QuestionEditButton from "@/components/QuestionEditButton";

const QuestionCard = ({ ques }: { ques: Models.Document }) => {
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
                <div className="mt-3">
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
                        <picture>
                            <img
                                src={avatars.getInitials(ques.author.name, 24, 24).href}
                                alt={ques.author.name}
                                className="rounded-lg"
                            />
                        </picture>
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
