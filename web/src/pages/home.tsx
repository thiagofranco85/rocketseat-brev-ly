import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Logo } from '../components/logo'
import { MyLinks } from '../components/my-links'
import { NewLinkForm } from '../components/new-link-form'
import { useCardInfo } from '../contexts/card-info'
import {
  createLink,
  deleteLink,
  downloadLinksCsv,
  listLinks,
} from '../http/links'
import { saveBlob } from '../lib/download'
import type { NewLink } from '../types/link'

export function Home() {
  const queryClient = useQueryClient()
  const { showCardInfo } = useCardInfo()

  const { data: links = [], isLoading } = useQuery({
    queryKey: ['links'],
    queryFn: listLinks,
  })

  function invalidateLinks() {
    return queryClient.invalidateQueries({ queryKey: ['links'] })
  }

  const createMutation = useMutation({
    mutationFn: createLink,
    onSuccess: invalidateLinks,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteLink,
    // O `shortUrl` chega no segundo argumento do `onSuccess`. O card não pode
    // sair do `LinkItem`: quando a exclusão termina, aquele item já foi
    // desmontado da lista e levaria o card junto.
    onSuccess: (_data, shortUrl) => {
      invalidateLinks()

      showCardInfo({
        variant: 'success',
        title: 'Link excluído com sucesso',
        description: `O link ${shortUrl} foi excluído.`,
      })
    },
  })

  // Sem card no sucesso: o próprio navegador já sinaliza o arquivo baixado.
  const downloadCsvMutation = useMutation({
    mutationFn: downloadLinksCsv,
    onSuccess: ({ blob, fileName }) => saveBlob(blob, fileName),
    onError: () =>
      showCardInfo({
        variant: 'danger',
        title: 'Não foi possível baixar o CSV',
        description: 'Tente novamente em alguns instantes.',
      }),
  })

  // `mutateAsync` propaga a rejeição para o formulário, que decide em qual campo
  // mostrar a mensagem. `mutate` engoliria o erro e o 409 não apareceria.
  async function handleCreate(link: NewLink) {
    await createMutation.mutateAsync(link)
  }

  function handleDelete(shortUrl: string) {
    deleteMutation.mutate(shortUrl)
  }

  function handleDownloadCsv() {
    downloadCsvMutation.mutate()
  }

  return (
    <main className="mx-auto w-full max-w-[980px] px-3 pt-8 lg:px-0 lg:pt-[88px]">
      <div className="mb-5 flex justify-center lg:mb-8 lg:justify-start">
        <Logo />
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[380px_1fr] lg:items-start lg:gap-5">
        <NewLinkForm onCreate={handleCreate} />
        <MyLinks
          links={links}
          isLoading={isLoading}
          onDelete={handleDelete}
          onDownloadCsv={handleDownloadCsv}
          isDownloadingCsv={downloadCsvMutation.isPending}
        />
      </div>
    </main>
  )
}
