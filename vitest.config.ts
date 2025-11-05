import { defineConfig } from 'vitest/config';
import path from 'path';

// Intentar importar el plugin de React, pero no fallar si no está instalado
let reactPlugin: any = null;
try {
  const react = require('@vitejs/plugin-react');
  reactPlugin = react.default || react;
} catch {
  console.warn('@vitejs/plugin-react no está instalado. Algunas pruebas de componentes pueden fallar.');
}

export default defineConfig({
  plugins: reactPlugin ? [reactPlugin()] : [],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.next'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.config.*',
        '**/types/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
