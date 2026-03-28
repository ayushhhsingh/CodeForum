import type { NextConfig } from "next";

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;

const remotePatterns = (() => {
  if (!endpoint) return [];

  try {
    const url = new URL(endpoint);

    return [
      {
        protocol: url.protocol.replace(":", "") as "http" | "https",
        hostname: url.hostname,
        port: url.port || undefined,
        pathname: "/**",
      },
    ];
  } catch {
    return [];
  }
})();

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
