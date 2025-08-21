import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Inspector from 'vite-plugin-react-inspector'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Inspector({
      enabled: true,
      toggleComboKey: 'meta-shift',
    }),
    react(),

  ],
})
