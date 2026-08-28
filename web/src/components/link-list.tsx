import type { Link } from '../types/link'
import { LinkItem } from './link-item'

type LinkListProps = {
  links: Link[]
  onDelete: (shortUrl: string) => void
}

export function LinkList({ links, onDelete }: LinkListProps) {
  return (
    <ul className="-mb-2.75 divide-y divide-gray-200 lg:-mb-3.75">
      {links.map((link) => (
        <LinkItem key={link.shortUrl} link={link} onDelete={onDelete} />
      ))}
    </ul>
  )
}
