import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable double-invocation of effects in dev (improves perceived speed)
  reactStrictMode: false,
  // Silence the workspace root warning by explicitly setting the Turbopack root
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
