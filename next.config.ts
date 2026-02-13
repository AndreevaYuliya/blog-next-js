import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "playground.zenberry.one",
        pathname: "/static/**",
      },
    ],
    localPatterns: [
      {
        pathname: "/api/image",
      },
    ],
  },
};

export default nextConfig;
