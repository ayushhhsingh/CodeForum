import { Permission, Role } from "node-appwrite";

import { db, questionCollection } from "../name";
import { databases } from "./config";

export default async function createQuestionCollection() {
  await databases.createCollection(db, questionCollection, questionCollection, [
    Permission.read(Role.any()),
    Permission.create(Role.users()),
    Permission.update(Role.users()),
    Permission.delete(Role.users()),
  ]);

  await Promise.all([
    databases.createStringAttribute(db, questionCollection, "title", 100, true),
    databases.createStringAttribute(db, questionCollection, "content", 1000, true),
    databases.createStringAttribute(db, questionCollection, "authorId", 100, true),
    databases.createStringAttribute(db, questionCollection, "tags", 100, true, undefined, true),
    databases.createStringAttribute(db, questionCollection, "attachmentId", 100, false),
  ]);
}
