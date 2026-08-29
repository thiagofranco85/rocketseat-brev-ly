import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Logo } from '../components/logo'
import { MyLinks } from '../components/my-links'
import { NewLinkForm } from '../components/new-link-form'
import { createLink, deleteLink, listLinks } from '../http/links'
import type { NewLink } from '../types/link'

export function Home() {
  const queryClient = useQueryClient()

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
    onSuccess: invalidateLinks,
  })

  // `mutateAsync` propaga a rejeição para o formulário, que decide em qual campo
  // mostrar a mensagem. `mutate` engoliria o erro e o 409 não apareceria.
  async function handleCreate(link: NewLink) {
    await createMutation.mutateAsync(link)
  }

  function handleDelete(shortUrl: string) {
    deleteMutation.mutate(shortUrl)
  }

  return (
    <main className="mx-auto w-full max-w-[980px] px-3 pt-8 lg:px-0 lg:pt-[88px]">
      <div className="mb-5 flex justify-center lg:mb-8 lg:justify-start">
        <Logo />
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[380px_1fr] lg:items-start lg:gap-5">
        <NewLinkForm onCreate={handleCreate} />
        <MyLinks links={links} isLoading={isLoading} onDelete={handleDelete} />
      </div>
    </main>
  )
}
