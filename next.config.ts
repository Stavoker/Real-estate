import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    qualities: [75, 90],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
