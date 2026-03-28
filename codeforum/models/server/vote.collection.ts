import { Permission } from "node-appwrite";
import { db, voteCollection } from "../name";
import { databases } from "./config";

type AppwriteError = Error & { code?: number; type?: string };

function isAlreadyExists(error: unknown): boolean {
    const e = error as AppwriteError;
    return e?.code === 409 || e?.type === "document_already_exists" || e?.type === "attribute_already_exists";
}

function isNotFound(error: unknown): boolean {
    const e = error as AppwriteError;
    return e?.code === 404 || e?.type === "attribute_not_found";
}

async function ensureAttribute(key: string, create: () => Promise<unknown>) {
    try {
        await databases.getAttribute(db, voteCollection, key);
    } catch (error) {
        if (!isNotFound(error)) {
            throw error;
        }

        try {
            await create();
        } catch (createError) {
            if (!isAlreadyExists(createError)) {
                throw createError;
            }
        }
    }
}

export default async function createVoteCollection() {
    try {
        await databases.createCollection(db, voteCollection, voteCollection, [
            Permission.create("users"),
            Permission.read("any"),
            Permission.read("users"),
            Permission.update("users"),
            Permission.delete("users"),
        ]);
        console.log("Vote Collection Created");
    } catch (error) {
        if (!isAlreadyExists(error)) {
            throw error;
        }
    }

    await Promise.all([
        ensureAttribute("type", () =>
            databases.createEnumAttribute(db, voteCollection, "type", ["question", "answer"], true)
        ),
        ensureAttribute("typeId", () =>
            databases.createStringAttribute(db, voteCollection, "typeId", 50, true)
        ),
        ensureAttribute("voteStatus", () =>
            databases.createEnumAttribute(
                db,
                voteCollection,
                "voteStatus",
                ["upvoted", "downvoted"],
                true
            )
        ),
        ensureAttribute("votedById", () =>
            databases.createStringAttribute(db, voteCollection, "votedById", 50, true)
        ),
    ]);
    console.log("Vote Attributes Ensured");
}
