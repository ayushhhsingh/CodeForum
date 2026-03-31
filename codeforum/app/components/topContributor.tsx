import { cn } from "@/lib/utils";
import { AnimatedList } from "@/components/magicui/animated-list";
import {
    getAppwriteErrorMessage,
    isPausedProjectError,
} from "@/lib/appwrite-error";
import { users } from "@/models/server/config";
import { Models, Query } from "node-appwrite";
import type { UserPrefs } from "@/models/user";
import convertDateToRelativeTime from "@/utils/relativeTime";

function getInitials(name: string) {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(part => part.charAt(0).toUpperCase())
        .join("");
}

const Notification = ({ user }: { user: Models.User<UserPrefs> }) => {
    return (
        <figure
            className={cn(
                "relative mx-auto min-h-fit w-full max-w-[400px] transform cursor-pointer overflow-hidden rounded-2xl p-4",
                // animation styles
                "transition-all duration-200 ease-in-out hover:scale-[103%]",
                // light styles
                "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
                // dark styles
                "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]"
            )}
        >
            <div className="flex flex-row items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black/10 text-sm font-semibold dark:bg-white/10 dark:text-white">
                    {getInitials(user.name)}
                </div>
                <div className="flex flex-col overflow-hidden">
                    <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white">
                        <span className="text-sm sm:text-lg">{user.name}</span>
                        <span className="mx-1">·</span>
                        <span className="text-xs text-gray-500">
                            {convertDateToRelativeTime(new Date(user.$updatedAt))}
                        </span>
                    </figcaption>
                    <p className="text-sm font-normal dark:text-white/60">
                        <span>Reputation</span>
                        <span className="mx-1">·</span>
                        <span className="text-xs text-gray-500">{user.prefs.reputation}</span>
                    </p>
                </div>
            </div>
        </figure>
    );
};

export default async function TopContributers() {
    let topUsers: Awaited<ReturnType<typeof users.list<UserPrefs>>> | null = null;
    let message = "";

    try {
        topUsers = await users.list<UserPrefs>([Query.limit(10)]);
    } catch (error) {
        message = isPausedProjectError(error)
            ? "Top contributors are unavailable because the Appwrite project is paused."
            : getAppwriteErrorMessage(error);
    }

    if (!topUsers) {
        return (
            <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-6">
                <h2 className="text-xl font-semibold">Contributors Unavailable</h2>
                <p className="mt-2 text-sm text-white/80">{message}</p>
            </div>
        );
    }

    return (
        <div className="bg-background relative flex max-h-[400px] min-h-[400px] w-full max-w-[32rem] flex-col overflow-hidden rounded-lg bg-white/10 p-6 shadow-lg">
            <AnimatedList>
                {topUsers.users.map(user => (
                    <Notification user={user} key={user.$id} />
                ))}
            </AnimatedList>
        </div>
    );
}
