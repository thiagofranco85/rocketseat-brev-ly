export type FileUpload = {
  fileName: string
  content: string
  contentType: string
}

export interface FileStorage {
  /**
   * Guarda o arquivo e devolve a URL pública de onde ele pode ser baixado.
   *
   * Quem chama não sabe qual CDN está por trás — é o que permite trocar R2 por
   * S3 sem tocar em quem exporta o CSV.
   */
  upload(file: FileUpload): Promise<string>
}
