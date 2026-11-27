import { resolve } from 'node:path';
import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

// 测试用 Vitest，也就是 Nest 12 新项目的默认测试栈：Vite 原生 ESM，
// Node 22 直接可用，不需要额外开关。
//
// 转换用 SWC 而不是 esbuild：Nest 的依赖注入靠装饰器元数据
// （design:paramtypes），esbuild 不产出，unplugin-swc 会保留
// legacyDecorator + decoratorMetadata。
//
// 用 .mts 而不是 .ts：本包是 CommonJS（没有 "type": "module"），.ts 会被
// 当成 CJS 加载，而这里写的是 ESM 语法，Vite 会警告未来版本将不再支持。
export default defineConfig(({ mode }) => ({
  plugins: [swc.vite({ module: { type: 'es6' } })],
  resolve: {
    // 源码里大量 `import ... from 'src/...'`（原先靠 tsconfig 的 baseUrl 解析），
    // Vite 不做 TS 的路径解析，需要显式补一条别名。
    alias: {
      src: resolve(import.meta.dirname, 'src'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    root: import.meta.dirname,
    // e2e 要连真实 MySQL/Redis，默认不跑；`pnpm test:e2e` 用 --mode e2e 切过去。
    include: mode === 'e2e' ? ['test/**/*.e2e-spec.ts'] : ['src/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      include: ['src/**/*.ts'],
    },
  },
}));
