import { S3Client } from '@aws-sdk/client-s3'
import { env } from '../env.ts'

/**
 * O R2 não tem SDK próprio para Node: ele expõe uma API compatível com S3, e a
 * Cloudflare indica o `@aws-sdk/client-s3` apontado para o endpoint dela.
 * Nenhuma requisição vai para a AWS — o `endpoint` decide o destino.
 *
 * `region: 'auto'` porque o SDK exige o campo e o R2 não usa regiões.
 */
export const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.CLOUDFLARE_ACCESS_KEY_ID,
    secretAccessKey: env.CLOUDFLARE_SECRET_ACCESS_KEY,
  },
})
