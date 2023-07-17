import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
  build: {
    target: 'es2020', // Set the target to ES2020 or newer
    polyfillDynamicImport: false, // Disable dynamic import polyfill if necessary
    esbuild: {
      // Set the '--module' option
      jsxFactory: 'React.createElement',
      jsxFragment: 'React.Fragment',
      // Other esbuild options...
    },
  },
});
