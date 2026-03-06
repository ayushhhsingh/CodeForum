import { databases } from "@/models/server/config";

type ConnectionState = {
  connected: boolean;
  message: string;
};

async function getAppwriteStatus(): Promise<ConnectionState> {
  try {
    await databases.list();
    return { connected: true, message: "Appwrite is connected successfully." };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { connected: false, message };
  }
}

export default async function Home() {
  const status = await getAppwriteStatus();

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 py-16">
      <h1 className="mb-4 text-3xl font-semibold">CodeForum</h1>
      <p className="mb-2 text-lg">
        Appwrite status:{" "}
        <span className={status.connected ? "text-green-600" : "text-red-600"}>
          {status.connected ? "Connected" : "Not Connected"}
        </span>
      </p>
      <p className="max-w-xl text-center text-sm text-zinc-600">{status.message}</p>
    </main>
  );
}
