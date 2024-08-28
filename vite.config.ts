import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import glsl from "vite-plugin-glsl";
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), glsl(),],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
})
