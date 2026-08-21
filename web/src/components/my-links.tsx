import { DownloadSimpleIcon } from '@phosphor-icons/react'
import type { Link } from '../types/link'
import { LinkList } from './link-list'
import { LinksEmpty } from './links-empty'
import { Button } from './ui/button'
import { Card } from './ui/card'

type MyLinksProps = {
  links: Link[]
  onDelete: (id: string) => void
}

export function MyLinks({ links, onDelete }: MyLinksProps) {
  const isEmpty = links.length === 0

  return (
    <Card>
      <div className="flex items-center justify-between gap-4 border-b border-gray-200 pb-4 lg:pb-5">
        <h2 className="text-lg text-gray-600">Meus links</h2>

        <Button
          variant="secondary"
          disabled={isEmpty}
          icon={<DownloadSimpleIcon size={16} />}
        >
          Baixar CSV
        </Button>
      </div>

      {isEmpty ? <LinksEmpty /> : <LinkList links={links} onDelete={onDelete} />}
    </Card>
  )
}
