import { LinkNotFoundError } from '../entities/errors.ts'
import { Link } from '../entities/link.ts'
import type { LinkRepository, LinkRow } from '../repositories/link-repository.ts'

export type CreateLinkInput = {
  originalUrl: string
  shortUrl: string
}

export class LinkService {
  readonly #repository: LinkRepository

  constructor(repository: LinkRepository) {
    this.#repository = repository
  }

  async create({ originalUrl, shortUrl }: CreateLinkInput): Promise<LinkRow> {
    return this.#repository.create(new Link(originalUrl, shortUrl))
  }

  async getByShortUrl(rawShortUrl: string): Promise<LinkRow> {
    const shortUrl = Link.normalizeShortUrl(rawShortUrl)
    const link = await this.#repository.findByShortUrl(shortUrl)

    if (!link) {
      throw new LinkNotFoundError(rawShortUrl)
    }

    return link
  }

  async list(): Promise<LinkRow[]> {
    return this.#repository.list()
  }

  async incrementAccessCount(rawShortUrl: string): Promise<LinkRow> {
    const shortUrl = Link.normalizeShortUrl(rawShortUrl)
    const updated = await this.#repository.incrementAccessCount(shortUrl)

    if (!updated) {
      throw new LinkNotFoundError(rawShortUrl)
    }

    return updated
  }

  async delete(rawShortUrl: string): Promise<void> {
    const shortUrl = Link.normalizeShortUrl(rawShortUrl)
    const deleted = await this.#repository.deleteByShortUrl(shortUrl)

    if (!deleted) {
      throw new LinkNotFoundError(rawShortUrl)
    }
  }
}
