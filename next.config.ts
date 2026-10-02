import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async redirects() {
    return [
      {
        source: '/',          
        destination: '/login', 
        permanent: false,       
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/documentacaoapi',
        destination: '/documentacaoapi.html',
      },
    ];
  },
};

export default nextConfig;