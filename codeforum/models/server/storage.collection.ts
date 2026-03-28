import { Permission, Role } from "node-appwrite";

import { questionAttachmentBucket } from "../name";
import { storage } from "./config";

export default async function createAttachmentBucket() {
  await storage.createBucket(
    questionAttachmentBucket,
    "Question Attachments",
    [
      Permission.read(Role.any()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ],
    true,
    true,
    10 * 1024 * 1024,
    ["jpg", "jpeg", "png", "gif", "webp"],
    undefined,
    false,
    false,
    true
  );
}
