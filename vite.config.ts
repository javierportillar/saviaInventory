import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

type NullableString = string | null | undefined;

const ensureTrailingSlash = (value: string): string =>
  value.endsWith('/') ? value : `${value}/`;

const normalizeBase = (rawValue: NullableString): string | undefined => {
  const value = rawValue?.trim();
  if (!value) {
    return undefined;
  }

  if (value === '.' || value === './') {
    return './';
  }

  try {
    const url = new URL(value, 'http://localhost');
    const pathname = url.pathname === '/' ? '/' : url.pathname.replace(/\/+$/, '');
    return ensureTrailingSlash(pathname);
  } catch {
    const normalized = value.replace(/^\/+|\/+$/g, '');
    return normalized ? `/${normalized}/` : '/';
  }
};

const resolveHomepageBase = (): string | undefined => {
  try {
    const packageJsonPath = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      'package.json',
    );
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {
      homepage?: string;
    };
    return normalizeBase(packageJson.homepage);
  } catch {
    return undefined;
  }
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const envBase = normalizeBase(env.VITE_BASE_PATH);
  const homepageBase = resolveHomepageBase();

  const isProduction = mode === 'production';

  const defaultBase = isProduction ? './' : '/';
  const base = envBase ?? homepageBase ?? defaultBase;

  return {
    base,
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
  };
});
