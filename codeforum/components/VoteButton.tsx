"use client";

import { databases } from "@/models/client/config";
import { db, voteCollection } from "@/models/name";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/utils";
import { IconCaretUpFilled, IconCaretDownFilled } from "@tabler/icons-react";
import { Models, Query } from "appwrite";
import { useRouter } from "next/navigation";
import React from "react";

export type VoteDocument = Models.Document & {
    voteStatus: "upvoted" | "downvoted";
};

type VoteListDocument = Models.Document;

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

const VoteButtons = ({
    type,
    id,
    upvotes,
    downvotes,
    className,
}: {
    type: "question" | "answer";
    id: string;
    upvotes: Models.DocumentList<VoteListDocument>;
    downvotes: Models.DocumentList<VoteListDocument>;
    className?: string;
}) => {
    const [votedDocument, setVotedDocument] = React.useState<VoteDocument | null>(); // undefined means not fetched yet
    const [voteResult, setVoteResult] = React.useState<number>(upvotes.total - downvotes.total);
    const [voteUnavailable, setVoteUnavailable] = React.useState(false);

    const { user } = useAuthStore();
    const router = useRouter();

    React.useEffect(() => {
        (async () => {
            if (user) {
                try {
                    const response = await databases.listDocuments<VoteDocument>(db, voteCollection, [
                        Query.equal("type", type),
                        Query.equal("typeId", id),
                        Query.equal("votedById", user.$id),
                    ]);
                    setVotedDocument(() => response.documents[0] || null);
                    setVoteUnavailable(false);
                } catch {
                    setVotedDocument(() => null);
                    setVoteUnavailable(true);
                }
            } else {
                setVotedDocument(() => null);
            }
        })();
    }, [user, id, type]);

    const toggleUpvote = async () => {
        if (!user) return router.push("/login");
        if (voteUnavailable) return;

        if (votedDocument === undefined) return;

        try {
            const response = await fetch(`/api/answer/vote`, {
                method: "POST",
                body: JSON.stringify({
                    votedById: user.$id,
                    voteStatus: "upvoted",
                    type,
                    typeId: id,
                }),
            });

            const data = await response.json();

            if (!response.ok) throw data;

            setVoteResult(() => data.data.voteResult);
            setVotedDocument(() => data.data.document as VoteDocument | null);
        } catch (error: unknown) {
            window.alert(getErrorMessage(error, "Something went wrong"));
        }
    };

    const toggleDownvote = async () => {
        if (!user) return router.push("/login");
        if (voteUnavailable) return;

        if (votedDocument === undefined) return;

        try {
            const response = await fetch(`/api/answer/vote`, {
                method: "POST",
                body: JSON.stringify({
                    votedById: user.$id,
                    voteStatus: "downvoted",
                    type,
                    typeId: id,
                }),
            });

            const data = await response.json();

            if (!response.ok) throw data;

            setVoteResult(() => data.data.voteResult);
            setVotedDocument(() => data.data.document as VoteDocument | null);
        } catch (error: unknown) {
            window.alert(getErrorMessage(error, "Something went wrong"));
        }
    };

    return (
        <div className={cn("flex shrink-0 flex-col items-center justify-start gap-y-4", className)}>
            <button
                className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border p-1 duration-200 hover:bg-white/10",
                    voteUnavailable && "cursor-not-allowed opacity-50",
                    votedDocument && votedDocument.voteStatus === "upvoted"
                        ? "border-orange-500 text-orange-500"
                        : "border-white/30"
                )}
                onClick={toggleUpvote}
                disabled={voteUnavailable}
            >
                <IconCaretUpFilled />
            </button>
            <span>{voteResult}</span>
            <button
                className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border p-1 duration-200 hover:bg-white/10",
                    voteUnavailable && "cursor-not-allowed opacity-50",
                    votedDocument && votedDocument.voteStatus === "downvoted"
                        ? "border-orange-500 text-orange-500"
                        : "border-white/30"
                )}
                onClick={toggleDownvote}
                disabled={voteUnavailable}
            >
                <IconCaretDownFilled />
            </button>
        </div>
    );
};

export default VoteButtons;
