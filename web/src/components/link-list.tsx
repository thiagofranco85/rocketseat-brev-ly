import { tv } from 'tailwind-variants'
import type { Link } from '../types/link'
import { LinkItem } from './link-item'

type LinkListProps = {
  links: Link[]
  onDelete: (shortUrl: string) => void
}

/** A partir do 8º link a lista rola em vez de crescer. */
const MAX_VISIBLE_LINKS = 7

// Todo LinkItem tem a mesma altura: os dois textos são `truncate`, então nunca
// quebram linha. Medidas vindas de link-item.tsx e dos tokens em index.css.
const ITEM_HEIGHT = 74 // py-[18px]*2 + (text-md 18 + gap-1 4 + text-sm 16)
const DIVIDER_HEIGHT = 1 // border-top que o `divide-y` põe entre os itens

const MAX_LIST_HEIGHT =
  MAX_VISIBLE_LINKS * ITEM_HEIGHT + (MAX_VISIBLE_LINKS - 1) * DIVIDER_HEIGHT

const list = tv({
  base: '-mb-2.75 divide-y divide-gray-200 overflow-y-auto lg:-mb-3.75 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-blue-base [&::-webkit-scrollbar-track]:bg-transparent',
  variants: {
    // O padding à direita só entra quando há barra de rolagem, senão a lista
    // sairia do alinhamento com o cabeçalho do card.
    hasScroll: {
      true: 'pr-3',
    },
  },
})

export function LinkList({ links, onDelete }: LinkListProps) {
  const hasScroll = links.length > MAX_VISIBLE_LINKS

  return (
    <ul style={{ maxHeight: MAX_LIST_HEIGHT }} className={list({ hasScroll })}>
      {links.map((link) => (
        <LinkItem key={link.shortUrl} link={link} onDelete={onDelete} />
      ))}
    </ul>
  )
}
