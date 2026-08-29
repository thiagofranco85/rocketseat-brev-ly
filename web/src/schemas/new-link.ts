import { z } from 'zod'

// Espelha o SHORT_URL_PATTERN de server/src/entities/link.ts, mas sem
// diferenciar maiúscula: o backend rebaixa o slug antes de gravar, então barrar
// `MEU-LINK` aqui seria mais restritivo que a própria API.
const SHORT_URL_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i

export const newLinkSchema = z.object({
  // A URL original não é validada aqui de propósito. O backend prefixa
  // `https://` antes de checar, e reproduzir isso no cliente rejeitaria
  // `www.exemplo.com.br` — que é justamente o placeholder do campo.
  originalUrl: z.string().min(1, 'Informe o link original.'),
  shortUrl: z
    .string()
    .min(1, 'Informe o link encurtado.')
    .min(3, 'Use de 3 a 64 caracteres.')
    .max(64, 'Use de 3 a 64 caracteres.')
    .regex(
      SHORT_URL_PATTERN,
      'Use apenas letras, números e hífen entre palavras.',
    ),
})

export type NewLinkFormData = z.infer<typeof newLinkSchema>
