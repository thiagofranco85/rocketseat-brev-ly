import type { Link } from '../entities/link.ts'

export type LinkRow = {
  id: string
  originalUrl: string
  shortUrl: string
  accessCount: number
  createdAt: Date
}

/** Projeção do CSV: as 4 colunas exigidas, sem o `id`. */
export type CsvLinkRow = Omit<LinkRow, 'id'>

export interface LinkRepository {
  /** @throws ShortUrlAlreadyExistsError quando o slug já está em uso. */
  create(link: Link): Promise<LinkRow>
  findByShortUrl(shortUrl: string): Promise<LinkRow | null>
  list(): Promise<LinkRow[]>
  deleteByShortUrl(shortUrl: string): Promise<boolean>
  incrementAccessCount(shortUrl: string): Promise<LinkRow | null>
  listForExport(): Promise<CsvLinkRow[]>
}
