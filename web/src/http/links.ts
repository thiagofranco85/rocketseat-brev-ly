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

export function deleteLink(shortUrl: string) {
  return api<void>(`/links/${encodeURIComponent(shortUrl)}`, {
    method: 'DELETE',
  })
}
