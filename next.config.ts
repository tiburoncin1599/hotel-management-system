import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      const externals = Array.isArray(config.externals) ? config.externals : [];
      config.externals = [
        ...externals,
        (ctx: { request?: string }, callback: (err?: Error | null, result?: string) => void) => {
          if (ctx.request && /^@prisma\//.test(ctx.request)) {
            callback(null, `commonjs ${ctx.request}`);
          } else {
            callback();
          }
        },
      ];
    }
    return config;
  },
};

export default nextConfig;
