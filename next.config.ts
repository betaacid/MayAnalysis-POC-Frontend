import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  // Removed 'output: export' to enable server-side rendering

  // Enable build caching with safer options
  experimental: {
    // Removed optimizeCss that requires critters module
    optimizeServerReact: true,
  },

  // Configure cache behavior
  generateBuildId: async () => {
    // You can customize the build ID for better caching
    // For now we'll use a timestamp-based ID
    return `build-${Date.now()}`;
  },

  // Make sure cache is properly persisted
  distDir: '.next',
};

export default nextConfig;
