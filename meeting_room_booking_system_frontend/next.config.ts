import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Next 16 的 standalone 文件追踪只拷了 @swc/helpers 的 cjs/，
  // 但 next/dist/server/require-hook.js 会去 require esm/ 下的文件，
  // 导致容器启动即 MODULE_NOT_FOUND。这里显式把整个包纳入追踪。
  outputFileTracingIncludes: {
    "/**/*": ["./node_modules/@swc/helpers/**/*"],
  },
};

export default nextConfig;
