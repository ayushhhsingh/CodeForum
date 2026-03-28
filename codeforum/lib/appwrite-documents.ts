import { databases } from "@/models/server/config";
import { commentCollection, db, voteCollection } from "@/models/name";
import { Models, Query } from "node-appwrite";

export function toPlain<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function emptyList(): Models.DocumentList<Models.Document> {
  return toPlain({
    total: 0,
    documents: [],
  }) as Models.DocumentList<Models.Document>;
}

export async function listVotesSafe(
  type: "question" | "answer",
  typeId: string,
  voteStatus?: "upvoted" | "downvoted"
) {
  try {
    const queries = [
      Query.equal("type", type),
      Query.equal("typeId", typeId),
      Query.limit(100),
    ];

    if (voteStatus) {
      queries.push(Query.equal("voteStatus", voteStatus));
    }

    return toPlain(await databases.listDocuments(db, voteCollection, queries));
  } catch {
    return emptyList();
  }
}

export async function listCommentsSafe(
  type: "question" | "answer",
  typeId: string
) {
  try {
    return toPlain(await databases.listDocuments(db, commentCollection, [
      Query.equal("targetType", type),
      Query.equal("targetId", typeId),
      Query.orderDesc("$createdAt"),
      Query.limit(100),
    ]));
  } catch {
    return emptyList();
  }
}
