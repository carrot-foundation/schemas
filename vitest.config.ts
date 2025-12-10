import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/__tests__/**/*.spec.{ts,js}', 'src/**/*.spec.{ts,js}'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/coverage/**'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['**/*.spec.ts', '**/index.ts', '**/test-utils/**'],
      thresholds: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100,
      },
      reporter: ['text', 'json', 'html', 'lcov'],
    },
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,
  },
});
