const { defineConfig } = require('vitest/config');

module.exports = defineConfig({
    test: {
        globals: true,
        environment: 'node',
        restoreMocks: true,
        include: ['**/*.test.js'],
        exclude: ['node_modules/**'],
        coverage: {
            provider: 'v8',
            reportsDirectory: './coverage',
            include: [
                'config/**/*.js',
                'controllers/**/*.js',
                'dtos/**/*.js',
                'exceptions/**/*.js',
                'middlewares/**/*.js',
                'router/**/*.js',
                'service/**/*.js',
            ],
        },
    },
});
