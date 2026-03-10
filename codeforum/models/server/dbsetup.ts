import { db } from "../name";
import { databases } from "./config";
import createAnswerCollection from "./answer.collection";
import createCommentCollection from "./comment.collection";
import createAttachmentCollection from "./storage.collection";
import createQuestionCollection from "./question.collection";
import createVoteCollection from "./vote.collection";

type AppwriteError = Error & { code?: number; type?: string };

function isAlreadyExists(error: unknown): boolean {
  const e = error as AppwriteError;
  return e?.code === 409 || e?.type === "document_already_exists";
}

async function ensureDatabase() {
  try {
    await databases.create(db, db);
    console.log(`Database created: ${db}`);
  } catch (error) {
    if (isAlreadyExists(error)) {
      console.log(`Database already exists: ${db}`);
      return;
    }
    throw error;
  }
}

async function ensureCollection(name: string, setup: () => Promise<void>) {
  try {
    await setup();
    console.log(`Collection created: ${name}`);
  } catch (error) {
    if (isAlreadyExists(error)) {
      console.log(`Collection already exists: ${name}`);
      return;
    }
    throw error;
  }
}

async function run() {
  await ensureDatabase();
  await ensureCollection("questions", createQuestionCollection);
  await ensureCollection("answers", createAnswerCollection);
  await ensureCollection("comments", createCommentCollection);
  await ensureCollection("votes", createVoteCollection);
  await ensureCollection("question-attachment", createAttachmentCollection);
  console.log("Appwrite DB setup completed.");
}

run().catch((error) => {
  console.error("Appwrite DB setup failed:", error);
  process.exit(1);
});
