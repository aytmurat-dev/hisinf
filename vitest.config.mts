import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: process.env.DATABASE_URI_TEST
      ? ['tests/unit/**/*.spec.ts', 'tests/int/**/*.int.spec.ts']
      : ['tests/unit/**/*.spec.ts'],
  },
})
