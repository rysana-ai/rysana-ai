import { defineConfig } from 'tsup'

export default defineConfig([
  // Core library
  {
    entry: ['core/index.ts'],
    format: ['cjs', 'esm'],
    external: ['ui', 'adapters', 'server'],
    dts: true,
  },
  // Server library
  {
    entry: ['server/index.ts'],
    outDir: 'server/dist',
    format: ['cjs', 'esm'],
    external: ['ui', 'adapters', 'server'],
    dts: true,
  },
  // React library
  {
    entry: ['ui/react/index.ts'],
    outDir: 'ui/react/dist',
    banner: { js: '"use client";' },
    format: ['cjs', 'esm'],
    external: ['ui', 'adapters', 'server'],
    dts: true,
  },
  // Third-party adapters
  {
    entry: ['adapters/openai/index.ts'],
    outDir: 'adapters/openai/dist',
    format: ['cjs', 'esm'],
    external: ['ui', 'adapters', 'server'],
    dts: true,
  },
])
