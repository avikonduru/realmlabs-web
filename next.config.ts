import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export', // Ensures `next export` is compatible
  trailingSlash: true, // Optional: ensures consistent paths
  images: {
    unoptimized: true, // Required if using the Next.js Image component
  },
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'],
  },
};

export default nextConfig;
