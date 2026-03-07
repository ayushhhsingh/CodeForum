import { Permission, Role } from "node-appwrite";

import { answerCollection, db } from "../name";
import { databases } from "./config";

export default async function createAnswerCollection() {
  await databases.createCollection(db, answerCollection, answerCollection, [
    Permission.read(Role.any()),
    Permission.create(Role.users()),
    Permission.update(Role.users()),
    Permission.delete(Role.users()),
  ]);

  await Promise.all([
    databases.createStringAttribute(db, answerCollection, "questionId", 100, true),
    databases.createStringAttribute(db, answerCollection, "content", 2000, true),
    databases.createStringAttribute(db, answerCollection, "authorId", 100, true),
  ]);
}
