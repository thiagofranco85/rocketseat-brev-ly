import type { Link } from '../types/link'
import { LinkItem } from './link-item'

type LinkListProps = {
  links: Link[]
  onDelete: (id: string) => void
}

export function LinkList({ links, onDelete }: LinkListProps) {
  return (
    <ul className="divide-y divide-gray-200">
      {links.map((link) => (
        <LinkItem key={link.id} link={link} onDelete={onDelete} />
      ))}
    </ul>
  )
}
