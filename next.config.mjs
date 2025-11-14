/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost", ".vercel.app"]
    }
  },
  images: {
    remotePatterns: []
  }
};

export default nextConfig;
