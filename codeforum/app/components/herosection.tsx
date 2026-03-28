import React from "react";
import { HeroParallax } from "@/components/ui/hero-parallax";
import {
    getAppwriteErrorMessage,
    isPausedProjectError,
} from "@/lib/appwrite-error";
import { databases } from "@/models/server/config";
import { db, questionAttachmentBucket, questionCollection } from "@/models/name";
import { unstable_noStore as noStore } from "next/cache";
import { Query } from "node-appwrite";
import slugify from "@/utils/slugify";
import { storage } from "@/models/client/config";
import HeroSectionHeader from "./herosectionHeader";

export default async function HeroSection() {
    noStore();

    let products:
        | {
              title: string;
              link: string;
              thumbnail: string;
          }[]
        | null = null;
    let message = "";

    try {
        const questions = await databases.listDocuments(db, questionCollection, [
            Query.orderDesc("$createdAt"),
            Query.limit(15),
        ]);

        products = questions.documents.map(q => ({
            title: q.title,
            link: `/questions/${q.$id}/${slugify(q.title)}`,
            thumbnail: q.attachmentId
                ? storage.getFilePreview(questionAttachmentBucket, q.attachmentId).href
                : "/globe.svg",
        }));
    } catch (error) {
        message = isPausedProjectError(error)
            ? "Question previews are unavailable because the Appwrite project is paused."
            : getAppwriteErrorMessage(error);
    }

    if (!products) {
        return (
            <section className="mx-auto max-w-6xl px-4 pt-28">
                <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-6">
                    <h2 className="text-2xl font-semibold">Question Feed Unavailable</h2>
                    <p className="mt-2 text-sm text-white/80">{message}</p>
                </div>
            </section>
        );
    }

    return <HeroParallax header={<HeroSectionHeader />} products={products} />;
}
