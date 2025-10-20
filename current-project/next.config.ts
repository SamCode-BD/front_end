import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:7286/api/:path*',
      },
    ];
  },
  output: 'export' //Creates a static build in the folder /out. On cloudflare, "output directory" has to be "/out"
                   //For a dynamic build, we would delete this line.
};

export default nextConfig;
