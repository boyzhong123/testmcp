import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  eslint: {
    // 构建时忽略 ESLint 错误（这些规则在 Next.js 15 中过于严格）
    ignoreDuringBuilds: true,
  },
};

export default withNextIntl(nextConfig);
