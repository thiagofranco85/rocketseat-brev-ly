export type Link = {
  id: string
  originalUrl: string
  shortUrl: string
  accessCount: number
  /** ISO 8601, como a API devolve em JSON. */
  createdAt: string
}

/** Campos que o formulário envia. O resto é gerado pelo servidor. */
export type NewLink = Pick<Link, 'originalUrl' | 'shortUrl'>
