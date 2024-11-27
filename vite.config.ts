/// <reference types="node" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      overlay: false
    }
    // https: {
    //   key: fs.readFileSync('./server.key'),
    //   cert: fs.readFileSync('./server.crt'),
    // },
    // port: 3000,
  },
})
