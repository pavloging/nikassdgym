// jsdom держим на 26: в 27 зависимость стала ESM-only и не грузится
// на node 18, а именно на нём собирается образ клиента и работает CI.
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
