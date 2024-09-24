/// <reference types="node" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync('./server.key'), // Caminho para o seu arquivo .key
      cert: fs.readFileSync('./server.crt'), // Caminho para o seu arquivo .cert
    },
    port: 3000, // Altere a porta se necessário
  },
})
