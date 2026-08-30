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

/** 404 `LINK_NOT_FOUND` quando o slug não existe. O servidor normaliza o slug. */
export function getLinkByShortUrl(shortUrl: string) {
  return api<Link>(`/links/${encodeURIComponent(shortUrl)}`)
}

export function deleteLink(shortUrl: string) {
  return api<void>(`/links/${encodeURIComponent(shortUrl)}`, {
    method: 'DELETE',
  })
}
