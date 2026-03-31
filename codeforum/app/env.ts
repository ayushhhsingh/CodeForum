function requirePublicEnv(name: string, value: string | undefined): string {
  const trimmed = value?.trim();

  if (!trimmed) {
    throw new Error(
      `Missing environment variable: ${name}. Add it to .env and restart the dev server.`
    );
  }

  return trimmed;
}

function requirePublicUrlEnv(name: string, value: string | undefined): string {
  const trimmed = requirePublicEnv(name, value);

  try {
    new URL(trimmed);
  } catch {
    throw new Error(
      `Invalid URL in environment variable: ${name}. Received "${trimmed}".`
    );
  }

  return trimmed;
}

const NEXT_PUBLIC_APPWRITE_ENDPOINT = requirePublicUrlEnv(
  "NEXT_PUBLIC_APPWRITE_ENDPOINT or APPWRITE_ENDPOINT",
  process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? process.env.APPWRITE_ENDPOINT
);

const NEXT_PUBLIC_APPWRITE_PROJECT_ID = requirePublicEnv(
  "NEXT_PUBLIC_APPWRITE_PROJECT_ID or APPWRITE_PROJECT_ID",
  process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? process.env.APPWRITE_PROJECT_ID
);

const env = {
  appwrite: {
    endpoint: NEXT_PUBLIC_APPWRITE_ENDPOINT,
    projectId: NEXT_PUBLIC_APPWRITE_PROJECT_ID,
  },
};

export default env;
