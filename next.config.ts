import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Next.js 16 配置
  // standalone 模式：构建产物只带必要依赖，打包给运维部署更方便
  output: 'standalone',
};

export default withNextIntl(nextConfig);
