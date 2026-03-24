"use client";

import { useAuthStore } from "@/store/auth";
import Link from "next/link";

type QuestionEditButtonProps = {
    questionId: string;
    questionSlug: string;
    authorId: string;
    className?: string;
    label?: string;
};

const baseClassName =
    "rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-black transition hover:bg-black/5 dark:border-white/[0.2] dark:text-white dark:hover:bg-white/10";

export default function QuestionEditButton({
    questionId,
    questionSlug,
    authorId,
    className = "",
    label = "Edit",
}: QuestionEditButtonProps) {
    const { hydrated, user } = useAuthStore();

    if (!hydrated || user?.$id !== authorId) return null;

    return (
        <Link
            href={`/questions/${questionId}/${questionSlug}/edit`}
            className={`${baseClassName} ${className}`.trim()}
        >
            {label}
        </Link>
    );
}
