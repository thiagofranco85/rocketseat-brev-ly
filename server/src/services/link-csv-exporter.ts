import { randomBytes } from 'node:crypto'
import type { CsvLinkRow, LinkRepository } from '../repositories/link-repository.ts'
import type { FileStorage } from '../storage/file-storage.ts'

const CSV_HEADER = 'original_url,short_url,access_count,created_at'
const CSV_LINE_BREAK = '\r\n'
const CSV_CONTENT_TYPE = 'text/csv; charset=utf-8'
const NEEDS_QUOTING = /["\r\n,]/
const FILE_NAME_RANDOM_BYTES = 3

export type CsvExport = {
  fileName: string
  url: string
}

export class LinkCsvExporter {
  readonly #repository: LinkRepository
  readonly #storage: FileStorage

  constructor(repository: LinkRepository, storage: FileStorage) {
    this.#repository = repository
    this.#storage = storage
  }

  /**
   * O conteúdo não volta na resposta: o arquivo é guardado na CDN e o que volta
   * é o endereço dele. O download deixa de passar pela API.
   */
  async export(): Promise<CsvExport> {
    const rows = await this.#repository.listForExport()
    const lines = [CSV_HEADER, ...rows.map((row) => LinkCsvExporter.#toLine(row))]
    const fileName = LinkCsvExporter.generateFileName()

    const url = await this.#storage.upload({
      fileName,
      content: `${lines.join(CSV_LINE_BREAK)}${CSV_LINE_BREAK}`,
      contentType: CSV_CONTENT_TYPE,
    })

    return { fileName, url }
  }

  /**
   * Ex.: `url-shotener-list-2026-08-28-14-32-07-a3f9c1.csv`.
   * A hora é UTC, igual à coluna `created_at`.
   * O sufixo aleatório é o que garante a unicidade exigida pela regra.
   */
  static generateFileName(now = new Date()): string {
    const [date, time] = now.toISOString().split('T')
    const clock = time.slice(0, 8).replaceAll(':', '-')
    const random = randomBytes(FILE_NAME_RANDOM_BYTES).toString('hex')

    return `url-shotener-list-${date}-${clock}-${random}.csv`
  }

  static #toLine(row: CsvLinkRow): string {
    return [
      LinkCsvExporter.#escape(row.originalUrl),
      LinkCsvExporter.#escape(row.shortUrl),
      String(row.accessCount),
      row.createdAt.toISOString(),
    ].join(',')
  }

  /** RFC 4180: uma URL com vírgula na query string quebraria a coluna. */
  static #escape(value: string): string {
    return NEEDS_QUOTING.test(value) ? `"${value.replaceAll('"', '""')}"` : value
  }
}
