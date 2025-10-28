import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
<<<<<<< HEAD
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
=======

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
>>>>>>> 6885616eb0c5a1f917a5a5a35f138080c924f29d
})
