import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/test/setup.ts'],
        css: false,
        restoreMocks: true,
        coverage: {
            provider: 'v8',
            reportsDirectory: './coverage',
            include: ['src/**/*.{ts,tsx}'],
            exclude: [
                'src/**/*.test.{ts,tsx}',
                'src/test/**',
                'src/main.tsx',
                'src/constants/**',
                'src/types/**',
                'src/**/*.d.ts',
            ],
        },
    },
});
