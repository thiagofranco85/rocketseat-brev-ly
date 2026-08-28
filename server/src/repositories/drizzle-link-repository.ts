import { desc, eq, sql } from 'drizzle-orm'
import type { Database } from '../db/client.ts'
import { urlShortener } from '../db/schema.ts'
import { ShortUrlAlreadyExistsError } from '../entities/errors.ts'
import type { Link } from '../entities/link.ts'
import type { CsvLinkRow, LinkRepository, LinkRow } from './link-repository.ts'

const linkColumns = {
  id: urlShortener.id,
  originalUrl: urlShortener.originalUrl,
  shortUrl: urlShortener.shortUrl,
  accessCount: urlShortener.accessCount,
  createdAt: urlShortener.createdAt,
}

const csvColumns = {
  originalUrl: urlShortener.originalUrl,
  shortUrl: urlShortener.shortUrl,
  accessCount: urlShortener.accessCount,
  createdAt: urlShortener.createdAt,
}

export class DrizzleLinkRepository implements LinkRepository {
  readonly #db: Database

  constructor(db: Database) {
    this.#db = db
  }

  /**
   * `ON CONFLICT DO NOTHING` evita a corrida de checar-e-inserir.
   * Dois POST simultâneos com o mesmo slug passariam os dois numa checagem
   * prévia, e um estouraria violação de unique crua como 500.
   * Aqui o perdedor apenas não recebe linha de volta.
   */
  async create(link: Link): Promise<LinkRow> {
    const [created] = await this.#db
      .insert(urlShortener)
      .values({ originalUrl: link.originalUrl, shortUrl: link.shortUrl })
      .onConflictDoNothing({ target: urlShortener.shortUrl })
      .returning(linkColumns)

    if (!created) {
      throw new ShortUrlAlreadyExistsError(link.shortUrl)
    }

    return created
  }

  async findByShortUrl(shortUrl: string): Promise<LinkRow | null> {
    const [link] = await this.#db
      .select(linkColumns)
      .from(urlShortener)
      .where(eq(urlShortener.shortUrl, shortUrl))
      .limit(1)

    return link ?? null
  }

  async list(): Promise<LinkRow[]> {
    return this.#db
      .select(linkColumns)
      .from(urlShortener)
      .orderBy(desc(urlShortener.createdAt))
  }

  async deleteByShortUrl(shortUrl: string): Promise<boolean> {
    const deleted = await this.#db
      .delete(urlShortener)
      .where(eq(urlShortener.shortUrl, shortUrl))
      .returning({ id: urlShortener.id })

    return deleted.length > 0
  }

  /**
   * Uma instrução só: o Postgres trava a linha, soma e devolve o valor novo.
   * Ler e depois gravar perderia contagem com dois acessos simultâneos.
   */
  async incrementAccessCount(shortUrl: string): Promise<LinkRow | null> {
    const [updated] = await this.#db
      .update(urlShortener)
      .set({ accessCount: sql`${urlShortener.accessCount} + 1` })
      .where(eq(urlShortener.shortUrl, shortUrl))
      .returning(linkColumns)

    return updated ?? null
  }

  async listForExport(): Promise<CsvLinkRow[]> {
    return this.#db
      .select(csvColumns)
      .from(urlShortener)
      .orderBy(desc(urlShortener.createdAt))
  }
}
