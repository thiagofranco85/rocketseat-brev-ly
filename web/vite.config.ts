import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Sem esta porta o Vite usa 5173, que é o default de todo projeto Vite da máquina —
    // colidia com o front do Bolsaê. strictPort faz falhar em vez de subir na porta
    // seguinte em silêncio (foi assim que 5 servidores zumbis se acumularam aqui).
    port: 5300,
    strictPort: true,
  },
  preview: {
    port: 4300,
    strictPort: true,
  },
})
