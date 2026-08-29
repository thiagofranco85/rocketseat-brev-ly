import { z } from 'zod'
import { InvalidOriginalUrlError, InvalidShortUrlError } from './errors.ts'

const SHORT_URL_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const SHORT_URL_MIN_LENGTH = 3
const SHORT_URL_MAX_LENGTH = 64
const PROTOCOL_PATTERN = /^https?:\/\//i

const originalUrlSchema = z.url()

/**
 * Link válido, pronto para ser persistido.
 *
 * A entidade só existe no caminho de escrita. Leituras devolvem projeções
 * (`LinkRow`), para que um registro antigo fora do padrão não derrube uma
 * listagem inteira ao ser revalidado.
 */
export class Link {
  readonly originalUrl: string
  readonly shortUrl: string

  constructor(originalUrl: string, shortUrl: string) {
    const normalizedShortUrl = Link.normalizeShortUrl(shortUrl)

    if (
      normalizedShortUrl.length < SHORT_URL_MIN_LENGTH ||
      normalizedShortUrl.length > SHORT_URL_MAX_LENGTH ||
      !SHORT_URL_PATTERN.test(normalizedShortUrl)
    ) {
      throw new InvalidShortUrlError(shortUrl)
    }

    const parsedOriginalUrl = originalUrlSchema.safeParse(
      Link.normalizeOriginalUrl(originalUrl),
    )

    if (!parsedOriginalUrl.success) {
      throw new InvalidOriginalUrlError(originalUrl)
    }

    this.originalUrl = parsedOriginalUrl.data
    this.shortUrl = normalizedShortUrl
  }

  /**
   * A constraint UNIQUE do Postgres em `text` é sensível a maiúsculas.
   * Sem normalizar, `Portfolio-Dev` e `portfolio-dev` virariam dois registros
   * e a regra de slug único ficaria furada.
   *
   * Precisa rodar também na leitura, na exclusão e no incremento — senão
   * `GET /links/Portfolio-Dev` não acha o `portfolio-dev` gravado.
   */
  static normalizeShortUrl(rawShortUrl: string): string {
    return rawShortUrl.trim().toLowerCase()
  }

  /** `www.exemplo.com.br` vira `https://www.exemplo.com.br`. */
  static normalizeOriginalUrl(rawOriginalUrl: string): string {
    const trimmed = rawOriginalUrl.trim()

    return PROTOCOL_PATTERN.test(trimmed) ? trimmed : `https://${trimmed}`
  }
}
