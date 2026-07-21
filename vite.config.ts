import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // base:'/enspeek/',
  base:'/',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split the heaviest, rarely-changing vendors into their own chunks
          // so they cache independently of app code and the charting library
          // only loads with the routes that use it.
          highcharts: ["highcharts", "highcharts-react-official"],
          "react-vendor": ["react", "react-dom", "react-router"],
        },
      },
    },
  },
})
