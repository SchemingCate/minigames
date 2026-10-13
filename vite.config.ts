import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: '/minigames/',
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text'],
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.test.ts',
        'src/main.ts', // bootstrap
      ],
    },
  },
});
