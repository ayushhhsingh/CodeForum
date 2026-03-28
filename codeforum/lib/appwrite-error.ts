export function getAppwriteErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null && "message" in error) {
    const message = error.message;
    if (typeof message === "string") {
      return message;
    }
  }

  return "Appwrite is currently unavailable.";
}

export function isPausedProjectError(error: unknown): boolean {
  return /project is paused due to inactivity/i.test(
    getAppwriteErrorMessage(error)
  );
}
