import { users } from "@/models/server/config";
import type { UserPrefs } from "@/models/user";
import {
  getAppwriteErrorMessage,
  isPausedProjectError,
} from "@/lib/appwrite-error";
import AnimatedGridPattern from "@/components/magicui/animated-grid-pattern";
import convertDateToRelativeTime from "@/utils/relativeTime";
import { cn } from "@/utils/cn";
import React from "react";
import EditButton from "../../EditButton";
import Navbar from "../../Navbar";
import { IconClockFilled, IconUserFilled } from "@tabler/icons-react";

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ userId: string; userSlug: string }>;
}) => {
  const { userId } = await params;
  let user: UserPrefs | null = null;
  let message = "";

  try {
    user = await users.get<UserPrefs>(userId);
  } catch (error) {
    message = isPausedProjectError(error)
      ? "This Appwrite project is paused. Restore it from the Appwrite console to load user profiles again."
      : getAppwriteErrorMessage(error);
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 pb-20 pt-32">
        <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-6">
          <h1 className="text-2xl font-semibold">User Profile Unavailable</h1>
          <p className="mt-2 text-sm text-white/80">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.25}
        duration={3}
        repeatDelay={1}
        className={cn(
          "absolute inset-0 opacity-60",
          "[mask-image:radial-gradient(1000px_circle_at_center,white,transparent)]"
        )}
      />
      <div className="container relative z-10 mx-auto space-y-4 px-4 pb-20 pt-32">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="w-24 shrink-0">
            <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/10 shadow-xl">
              {user.prefs?.avatarUrl ? (
                <img
                  src={user.prefs.avatarUrl}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-2xl font-semibold tracking-wide text-white">
                  {getInitials(user.name)}
                </span>
              )}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,165,0,0.18),transparent_58%)]" />
            </div>
          </div>
          <div className="w-full">
            <div className="flex items-start justify-between">
              <div className="block space-y-0.5">
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-lg text-gray-500">{user.email}</p>
                <p className="flex items-center gap-1 text-sm font-bold text-gray-500">
                  <IconUserFilled className="w-4 shrink-0" /> Dropped{" "}
                  {convertDateToRelativeTime(new Date(user.$createdAt))},
                </p>
                <p className="flex items-center gap-1 text-sm text-gray-500">
                  <IconClockFilled className="w-4 shrink-0" /> Last activity&nbsp;
                  {convertDateToRelativeTime(new Date(user.$updatedAt))}
                </p>
              </div>
              <div className="shrink-0">
                <EditButton />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Navbar />
          <div className="w-full">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
