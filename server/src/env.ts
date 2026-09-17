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
  // Origem liberada no CORS. Em dev é a porta fixa do Vite (vite.config.ts); em
  // produção (Render) precisa ser setada pra `https://brevly.thiagofranco.com.br`.
  // Preprocess pra cair no default também quando a chave existe vazia no `.env`
  // (padrão deste arquivo), e não só quando está ausente.
  WEB_URL: z.preprocess(
    (value) => (value === '' ? undefined : value),
    z.url().default('http://localhost:5300')
  ),
})

export const env = envSchema.parse(process.env)
