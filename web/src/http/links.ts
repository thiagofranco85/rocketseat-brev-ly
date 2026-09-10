import type { Link, NewLink } from '../types/link'
import { api, apiRaw } from './client'

const CSV_FALLBACK_FILE_NAME = 'url-shotener-list.csv'

/**
 * O backend sempre manda a forma entre aspas (`attachment; filename="..."`),
 * então o padrão casa só com ela. Um padrão frouxo (`filename=?...`) casaria por
 * engano com a forma `filename*=UTF-8''...` da RFC 5987 e devolveria `*=UTF-8`
 * como nome do arquivo.
 */
const CSV_FILE_NAME_PATTERN = /filename="([^"]+)"/i

/** Já vem ordenado por data de criação, do mais novo para o mais antigo. */
export function listLinks() {
  return api<Link[]>('/links')
}

export function createLink(link: NewLink) {
  return api<Link>('/links', {
    method: 'POST',
    body: JSON.stringify(link),
  })
}

/**
 * Conta o acesso e devolve o link já atualizado — mesma resposta do
 * `GET /links/:shortUrl`. Por isso a página de redirecionamento não precisa de
 * duas chamadas: uma para contar e outra para descobrir o destino.
 *
 * 404 `LINK_NOT_FOUND` quando o slug não existe. O servidor normaliza o slug.
 */
export function incrementAccessCount(shortUrl: string) {
  return api<Link>(`/links/${encodeURIComponent(shortUrl)}/access-count`, {
    method: 'PATCH',
  })
}

export function deleteLink(shortUrl: string) {
  return api<void>(`/links/${encodeURIComponent(shortUrl)}`, {
    method: 'DELETE',
  })
}

/**
 * Baixa o relatório e devolve o conteúdo junto do nome que o servidor escolheu.
 *
 * O nome vem do `Content-Disposition`, que o CORS do backend expõe de propósito
 * (`exposedHeaders`). Sem ele o navegador salvaria com um nome inventado e a
 * falha seria silenciosa — daí o nome de reserva. O reserva não tem o sufixo
 * aleatório porque "nome aleatório e único" é regra do servidor: reproduzi-la
 * aqui criaria uma segunda fonte da mesma regra.
 */
export async function downloadLinksCsv() {
  const response = await apiRaw('/exports/links.csv')
  const disposition = response.headers.get('Content-Disposition')

  return {
    blob: await response.blob(),
    fileName:
      disposition?.match(CSV_FILE_NAME_PATTERN)?.[1] ?? CSV_FALLBACK_FILE_NAME,
  }
}
