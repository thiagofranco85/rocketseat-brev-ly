import { db } from './db/client.ts'
import { DrizzleLinkRepository } from './repositories/drizzle-link-repository.ts'
import { LinkCsvExporter } from './services/link-csv-exporter.ts'
import { LinkService } from './services/link-service.ts'

/**
 * Composition root: o único lugar que decide quem recebe o quê.
 * O ESM executa este módulo uma vez só, então as instâncias são compartilhadas.
 */
const linkRepository = new DrizzleLinkRepository(db)

export const linkService = new LinkService(linkRepository)
export const linkCsvExporter = new LinkCsvExporter(linkRepository)
