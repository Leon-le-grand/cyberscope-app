// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Replace 'domains' with 'remotePatterns' for Next.js 13+
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org', // Add this for Wikipedia images
        // If Wikimedia images are only from a specific path, you can be more precise:
        // pathname: '/wikipedia/commons/thumb/**',
      },
      // Add any other external image hostnames here as needed
      // {
      //   protocol: 'https',
      //   hostname: 'another-image-cdn.com',
      // },
    ],
  },
  /* other config options here */
};

export default nextConfig;
