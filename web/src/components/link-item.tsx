import { CopyIcon, TrashIcon } from '@phosphor-icons/react'
import { SHORT_LINK_HOST } from '../config'
import { useCardInfo } from '../contexts/card-info'
import type { Link } from '../types/link'
import { IconButton } from './ui/icon-button'

type LinkItemProps = {
  link: Link
  onDelete: (shortUrl: string) => void
}

export function LinkItem({ link, onDelete }: LinkItemProps) {
  const { showCardInfo } = useCardInfo()

  const shortLink = `${SHORT_LINK_HOST}/${link.shortUrl}`

  // `navigator.clipboard` não existe fora de contexto seguro e a escrita pode
  // ser negada pelo navegador. Sem o `catch`, a falha ficaria invisível: o
  // usuário veria o clique não fazer nada.
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shortLink)

      showCardInfo({
        variant: 'info',
        title: 'Link copiado com sucesso',
        description: `O link ${link.shortUrl} foi copiado para a área de transferência.`,
      })
    } catch {
      showCardInfo({
        variant: 'danger',
        title: 'Não foi possível copiar',
        description: `Copie manualmente o link ${shortLink}.`,
      })
    }
  }

  function handleDelete() {
    if (window.confirm(`Você tem certeza que deseja apagar o link ${shortLink}?`)) {
      onDelete(link.shortUrl)
    }
  }

  return (
    <li className="flex items-center gap-4 py-[18px] lg:gap-5">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <a
          href={`/${link.shortUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="truncate text-md text-blue-base hover:underline"
        >
          {shortLink}
        </a>
        <span className="truncate text-sm text-gray-500">
          {link.originalUrl}
        </span>
      </div>

      <span className="shrink-0 text-sm text-gray-500">
        {link.accessCount} acessos
      </span>

      <div className="flex shrink-0 gap-1">
        <IconButton
          aria-label={`Copiar ${shortLink}`}
          title="Copiar link"
          onClick={handleCopy}
          icon={<CopyIcon size={16} />}
        />
        <IconButton
          aria-label={`Excluir ${shortLink}`}
          title="Excluir link"
          onClick={handleDelete}
          icon={<TrashIcon size={16} />}
        />
      </div>
    </li>
  )
}
