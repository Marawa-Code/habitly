import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here - reloaded 2026-11-07 */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
