import type { Link, NewLink } from '../types/link'
import { api } from './client'

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
