import { Permission, Role } from "node-appwrite";

import { profileAvatarBucket } from "../name";
import { storage } from "./config";

export default async function createProfileAvatarBucket() {
  await storage.createBucket(
    profileAvatarBucket,
    "Profile Avatars",
    [
      Permission.read(Role.any()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ],
    true,
    true,
    5 * 1024 * 1024,
    ["jpg", "jpeg", "png", "gif", "webp"],
    undefined,
    false,
    false,
    true
  );
}
