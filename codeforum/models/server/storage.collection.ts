import { Permission, Role } from "node-appwrite";

import { attachmentCollection, db } from "../name";
import { databases } from "./config";

export default async function createAttachmentCollection() {
  await databases.createCollection(db, attachmentCollection, attachmentCollection, [
    Permission.read(Role.any()),
    Permission.create(Role.users()),
    Permission.update(Role.users()),
    Permission.delete(Role.users()),
  ]);

  await Promise.all([
    databases.createStringAttribute(db, attachmentCollection, "fileId", 100, true),
    databases.createStringAttribute(db, attachmentCollection, "questionId", 100, true),
    databases.createStringAttribute(db, attachmentCollection, "uploadedBy", 100, true),
  ]);
}
