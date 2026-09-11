import { PutObjectCommand, type S3Client } from '@aws-sdk/client-s3'
import type { FileStorage, FileUpload } from './file-storage.ts'

export type R2Config = {
  bucket: string
  /** Base pública do bucket, sem barra no fim. */
  publicUrl: string
}

export class R2FileStorage implements FileStorage {
  readonly #client: S3Client
  readonly #bucket: string
  readonly #publicUrl: string

  constructor(client: S3Client, config: R2Config) {
    this.#client = client
    this.#bucket = config.bucket
    this.#publicUrl = config.publicUrl
  }

  /**
   * O `ContentDisposition` é gravado junto com o objeto, e não deixado para o
   * front: o atributo `download` de um `<a>` é ignorado quando o link aponta
   * para outra origem. Sem este header, clicar no link do R2 abriria o CSV numa
   * aba em vez de salvar o arquivo.
   */
  async upload(file: FileUpload): Promise<string> {
    await this.#client.send(
      new PutObjectCommand({
        Bucket: this.#bucket,
        Key: file.fileName,
        Body: file.content,
        ContentType: file.contentType,
        ContentDisposition: `attachment; filename="${file.fileName}"`,
      }),
    )

    return `${this.#publicUrl}/${file.fileName}`
  }
}
