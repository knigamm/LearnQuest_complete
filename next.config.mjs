import { withNextVideo } from "next-video/process";
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "learn-quest.s3.ap-south-1.amazonaws.com",
      },
    ],
  },
};

export default withNextVideo(nextConfig);