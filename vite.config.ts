import * as path from 'path'

import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import EnvironmentPlugin from 'vite-plugin-environment'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/countdown/',
  build: {
    sourcemap: true,
  },
  plugins: [
    react(),
    // Object form: values are used as defaults when the env var is unset,
    // so the build doesn't fail in CI (where .env isn't checked in).
    EnvironmentPlugin({ REACT_APP_TEXT: "I'm REACT_APP_TEXT from .env" }),
  ],
  publicDir: 'public',
  server: {
    host: true,
    port: 3000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
