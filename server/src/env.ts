import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.url(),
  CLOUDFLARE_ACCOUNT_ID: z.string().min(1),
  CLOUDFLARE_ACCESS_KEY_ID: z.string().min(1),
  CLOUDFLARE_SECRET_ACCESS_KEY: z.string().min(1),
  CLOUDFLARE_BUCKET: z.string().min(1),
  // URL pública do bucket (`https://pub-....r2.dev`), de onde o navegador baixa
  // o CSV. Não confundir com o endpoint autenticado, que é montado a partir do
  // `CLOUDFLARE_ACCOUNT_ID` e só o servidor usa.
  CLOUDFLARE_PUBLIC_URL: z.url(),
})

export const env = envSchema.parse(process.env)
