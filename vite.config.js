import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import * as path from 'path'

const resovle = (p) => {
  return path.resolve(__dirname, p)
}

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': resovle('./src')
    }
  },
  base: "./",
  plugins: [vue()],
});
