import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const ensureBaseFormat = (value: string): string => {
  if (!value) {
    return './';
  }

  if (value === '.' || value === './') {
    return './';
  }

  const trimmed = value.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      const { pathname } = new URL(trimmed);
      return pathname.endsWith('/') ? pathname : `${pathname}/`;
    } catch {
      return './';
    }
  }

  const normalized = trimmed.replace(/(^\/*|\/*$)/g, '');
  return normalized ? `/${normalized}/` : './';
};

const DEFAULT_PRODUCTION_BASE = './';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const envBase = env.VITE_BASE_PATH?.trim();

  const productionBase = envBase ?? DEFAULT_PRODUCTION_BASE;
  const base = mode === 'production' ? productionBase : '/';

  // Demo mode: en producción, ignorar Supabase y usar datos locales
  const isDemo = mode === 'production' || env.VITE_DEMO_MODE === 'true';

  return {
    base,
    plugins: [react()],
    define: {
      'import.meta.env.VITE_DEMO_MODE': isDemo ? '"true"' : '"false"',
    },
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    build: {
      outDir: 'docs',
      emptyOutDir: true,
      rollupOptions: {
        output: {
          entryFileNames: 'assets/[name].js',
          chunkFileNames: 'assets/[name].js',
          assetFileNames: 'assets/[name][extname]',
        },
      },
    },
  };
});
