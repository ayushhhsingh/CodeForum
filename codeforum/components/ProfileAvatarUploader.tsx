"use client";

import { account, storage } from "@/models/client/config";
import { profileAvatarBucket } from "@/models/name";
import type { UserPrefs } from "@/models/user";
import { useAuthStore } from "@/store/auth";
import { ID, Permission, Role } from "appwrite";
import { IconCamera, IconLoader2 } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React from "react";

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

type Props = {
  profileUserId: string;
  name: string;
  avatarUrl?: string;
  avatarFileId?: string;
};

export default function ProfileAvatarUploader({
  profileUserId,
  name,
  avatarUrl,
  avatarFileId,
}: Props) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { user, refreshUser } = useAuthStore();
  const [previewUrl, setPreviewUrl] = React.useState(avatarUrl || "");
  const [error, setError] = React.useState("");
  const [uploading, setUploading] = React.useState(false);

  const isOwner = user?.$id === profileUserId;

  React.useEffect(() => {
    setPreviewUrl(avatarUrl || "");
  }, [avatarUrl]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Profile photo must be 5MB or smaller.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const permissions = [
        Permission.read(Role.any()),
        Permission.update(Role.user(user.$id)),
        Permission.delete(Role.user(user.$id)),
      ];

      const uploaded = await storage.createFile(
        profileAvatarBucket,
        ID.unique(),
        file,
        permissions
      );

      if (avatarFileId) {
        try {
          await storage.deleteFile(profileAvatarBucket, avatarFileId);
        } catch {
          // Keep the new upload even if an older avatar file cannot be removed.
        }
      }

      const nextAvatarUrl = storage.getFileView(profileAvatarBucket, uploaded.$id).href;
      const existingPrefs = user.prefs || ({} as UserPrefs);

      await account.updatePrefs({
        ...existingPrefs,
        reputation: Number(existingPrefs.reputation || 0),
        avatarUrl: nextAvatarUrl,
        avatarFileId: uploaded.$id,
      });

      setPreviewUrl(nextAvatarUrl);
      await refreshUser();
      router.refresh();
    } catch (uploadError) {
      console.error(uploadError);
      setError("Unable to upload profile photo right now.");
    } finally {
      setUploading(false);
      if (event.target) {
        event.target.value = "";
      }
    }
  };

  return (
    <div className="w-28 shrink-0">
      <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/10 shadow-xl">
        {previewUrl ? (
          <img src={previewUrl} alt={name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-3xl font-semibold tracking-wide text-white">
            {getInitials(name)}
          </span>
        )}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,165,0,0.18),transparent_58%)]" />
      </div>

      {isOwner ? (
        <div className="mt-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-medium text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {uploading ? <IconLoader2 className="h-4 w-4 animate-spin" /> : <IconCamera className="h-4 w-4" />}
            {uploading ? "Uploading..." : "Upload DP"}
          </button>
          <p className="mt-2 text-center text-[11px] text-white/50">JPG, PNG, GIF, WEBP up to 5MB</p>
          {error ? <p className="mt-2 text-center text-xs text-red-400">{error}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
