/**
 * Dispara o download do arquivo que está na URL dada.
 *
 * Fica fora de `src/http/` de propósito: mexer no documento não é trabalho da
 * camada que fala com a API.
 *
 * Sem `<a download>`: o atributo é ignorado quando o link aponta para outra
 * origem, e a CDN é outra origem. Quem faz o navegador salvar em vez de abrir
 * numa aba é o `Content-Disposition: attachment` que o servidor grava junto com
 * o objeto no upload. Como a resposta é um anexo, a página não navega.
 */
export function startDownload(url: string) {
  window.location.href = url
}
