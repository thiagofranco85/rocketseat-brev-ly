import { LinkIcon } from '@phosphor-icons/react'

export function LinksEmpty() {
  return (
    <div className="flex flex-col items-center gap-5 py-6">
      <LinkIcon size={32} className="text-gray-400" />
      <p className="text-center text-xs text-gray-500 uppercase">
        Ainda não existem links cadastrados
      </p>
    </div>
  )
}
