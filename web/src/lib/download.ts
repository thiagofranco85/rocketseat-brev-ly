/**
 * Dispara o download de um blob com o nome dado.
 *
 * Fica fora de `src/http/` de propósito: mexer no documento não é trabalho da
 * camada que fala com a API.
 *
 * O `click()` resolve a URL do blob de forma síncrona, então revogar logo
 * depois não corta o download — e não deixa o blob preso na memória. Conferido
 * no Chromium: o arquivo salvo saiu íntegro. Sem `appendChild` no `body`: o
 * Firefox exigia isso antes da versão 61, os navegadores atuais não. Se um dia
 * o arquivo salvo vier vazio em algum navegador, é aqui que se investiga.
 */
export function saveBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')

  anchor.href = url
  anchor.download = fileName
  anchor.click()

  URL.revokeObjectURL(url)
}
