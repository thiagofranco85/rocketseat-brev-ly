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
  onDownloadCsv: () => void
  isDownloadingCsv: boolean
}

export function MyLinks({
  links,
  isLoading,
  onDelete,
  onDownloadCsv,
  isDownloadingCsv,
}: MyLinksProps) {
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

        {/*
          A prop `loading` do Button não serve aqui: ela troca ícone e texto por
          um spinner sozinho, e nesta variante a largura vem do conteúdo — o
          botão encolheria e o cabeçalho daria um salto. Daí o spinner entrar
          pelo slot do ícone, o texto mudar e a largura mínima ficar fixa. O
          `aria-busy`, que a prop `loading` daria de graça, vai à mão.
        */}
        <Button
          variant="secondary"
          className="min-w-[112px]"
          disabled={isEmpty || isDownloadingCsv}
          aria-busy={isDownloadingCsv}
          onClick={onDownloadCsv}
          icon={
            isDownloadingCsv ? (
              <SpinnerIcon size={16} className="animate-spin" />
            ) : (
              <DownloadSimpleIcon size={16} />
            )
          }
        >
          {isDownloadingCsv ? 'Baixando…' : 'Baixar CSV'}
        </Button>
      </div>

      {renderContent()}
    </Card>
  )
}
