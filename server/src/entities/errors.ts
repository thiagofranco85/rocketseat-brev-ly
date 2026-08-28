/**
 * Erros de domínio carregam um código estável, nunca um status HTTP.
 * A tradução para HTTP acontece só na borda, em `error-handler.ts`.
 */
export class DomainError extends Error {
  readonly code: string

  constructor(code: string, message: string) {
    super(message)
    this.code = code
    this.name = new.target.name
  }
}

export class InvalidShortUrlError extends DomainError {
  constructor(shortUrl: string) {
    super('INVALID_SHORT_URL', `Short URL "${shortUrl}" is malformed.`)
  }
}

export class InvalidOriginalUrlError extends DomainError {
  constructor(originalUrl: string) {
    super('INVALID_ORIGINAL_URL', `Original URL "${originalUrl}" is not a valid URL.`)
  }
}

export class ShortUrlAlreadyExistsError extends DomainError {
  constructor(shortUrl: string) {
    super('SHORT_URL_ALREADY_EXISTS', `Short URL "${shortUrl}" is already in use.`)
  }
}

export class LinkNotFoundError extends DomainError {
  constructor(shortUrl: string) {
    super('LINK_NOT_FOUND', `No link found for short URL "${shortUrl}".`)
  }
}
