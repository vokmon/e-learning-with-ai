/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["langchain", "@langchain/core"],
  },
};

export default nextConfig;
