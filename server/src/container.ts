import { db } from './db/client.ts'
import { env } from './env.ts'
import { DrizzleLinkRepository } from './repositories/drizzle-link-repository.ts'
import { LinkCsvExporter } from './services/link-csv-exporter.ts'
import { LinkService } from './services/link-service.ts'
import { r2 } from './storage/r2-client.ts'
import { R2FileStorage } from './storage/r2-file-storage.ts'

/**
 * Composition root: o único lugar que decide quem recebe o quê.
 * O ESM executa este módulo uma vez só, então as instâncias são compartilhadas.
 */
const linkRepository = new DrizzleLinkRepository(db)

const csvStorage = new R2FileStorage(r2, {
  bucket: env.CLOUDFLARE_BUCKET,
  publicUrl: env.CLOUDFLARE_PUBLIC_URL,
})

export const linkService = new LinkService(linkRepository)
export const linkCsvExporter = new LinkCsvExporter(linkRepository, csvStorage)
