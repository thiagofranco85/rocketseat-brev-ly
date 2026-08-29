import { DownloadSimpleIcon, SpinnerIcon } from '@phosphor-icons/react'
import type { Link } from '../types/link'
import { LinkList } from './link-list'
import { LinksEmpty } from './links-empty'
import { Button } from './ui/button'
import { Card } from './ui/card'

type MyLinksProps = {
  links: Link[]
  isLoading: boolean
  onDelete: (shortUrl: string) => void
}

export function MyLinks({ links, isLoading, onDelete }: MyLinksProps) {
  const isEmpty = links.length === 0

  // Enquanto a primeira busca não volta, a lista está vazia mas não é um estado
  // vazio: mostrar "ainda não existem links" aqui faria o empty state piscar.
  function renderContent() {
    if (isLoading) {
      return (
        <div className="flex justify-center py-6">
          <SpinnerIcon size={32} className="animate-spin text-gray-400" />
        </div>
      )
    }

    if (isEmpty) {
      return <LinksEmpty />
    }

    return <LinkList links={links} onDelete={onDelete} />
  }

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

      {renderContent()}
    </Card>
  )
}
