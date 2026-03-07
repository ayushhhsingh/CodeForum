import { Permission, Role } from "node-appwrite";

import { commentCollection, db } from "../name";
import { databases } from "./config";

export default async function createCommentCollection() {
  await databases.createCollection(db, commentCollection, commentCollection, [
    Permission.read(Role.any()),
    Permission.create(Role.users()),
    Permission.update(Role.users()),
    Permission.delete(Role.users()),
  ]);

  await Promise.all([
    databases.createStringAttribute(db, commentCollection, "targetId", 100, true),
    databases.createStringAttribute(db, commentCollection, "targetType", 20, true),
    databases.createStringAttribute(db, commentCollection, "content", 1000, true),
    databases.createStringAttribute(db, commentCollection, "authorId", 100, true),
  ]);
}
