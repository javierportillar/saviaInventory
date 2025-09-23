import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const baseEnv = env.VITE_BASE_PATH?.trim();

  const isProduction = mode === 'production';

  let base = isProduction ? './' : '/';
  if (baseEnv) {
    if (baseEnv === '.' || baseEnv === './') {
      base = './';
    } else {
      const normalized = baseEnv.replace(/^\/+|\/+$/g, '');
      base = normalized ? `/${normalized}/` : '/';
    }
  }

  return {
    base,
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
  };
});
