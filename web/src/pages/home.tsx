import { useState } from 'react'
import { Logo } from '../components/logo'
import { MyLinks } from '../components/my-links'
import { NewLinkForm } from '../components/new-link-form'
import { mockLinks } from '../data/mock-links'
import type { Link, NewLink } from '../types/link'

export function Home() {
  const [links, setLinks] = useState<Link[]>(mockLinks)

  // Espelha o que o backend faz antes de gravar: slug em minúsculo e
  // protocolo implícito na URL original. Some quando a API entrar.
  function handleCreate(link: NewLink) {
    setLinks((current) => [
      ...current,
      {
        ...link,
        shortUrl: link.shortUrl.toLowerCase(),
        originalUrl: /^https?:\/\//i.test(link.originalUrl)
          ? link.originalUrl
          : `https://${link.originalUrl}`,
        id: crypto.randomUUID(),
        accessCount: 0,
        createdAt: new Date().toISOString(),
      },
    ])
  }

  function handleDelete(shortUrl: string) {
    setLinks((current) => current.filter((link) => link.shortUrl !== shortUrl))
  }

  return (
    <main className="mx-auto w-full max-w-[980px] px-3 pt-8 lg:px-0 lg:pt-[88px]">
      <div className="mb-5 flex justify-center lg:mb-8 lg:justify-start">
        <Logo />
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[380px_1fr] lg:items-start lg:gap-5">
        <NewLinkForm onCreate={handleCreate} />
        <MyLinks links={links} onDelete={handleDelete} />
      </div>
    </main>
  )
}
