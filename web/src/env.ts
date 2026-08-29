import { z } from 'zod'

// O tsconfig do projeto não liga `strict`, então o TypeScript não avisa quando
// a variável falta. Sem este parse, `undefined` viraria a string "undefined" no
// meio da URL e o fetch iria para `undefined/links` sem erro nenhum.
const envSchema = z.object({
  VITE_BACKEND_URL: z.url(),
})

export const env = envSchema.parse(import.meta.env)
