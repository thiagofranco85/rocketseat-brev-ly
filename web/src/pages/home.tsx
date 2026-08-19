import { useState } from 'react'
import { Logo } from '../components/logo'
import { MyLinks } from '../components/my-links'
import { NewLinkForm } from '../components/new-link-form'
import { mockLinks } from '../data/mock-links'
import type { Link } from '../types/link'

export function Home() {
  const [links, setLinks] = useState<Link[]>(mockLinks)

  function handleCreate(link: Omit<Link, 'id' | 'accessCount'>) {
    setLinks((current) => [
      ...current,
      { ...link, id: crypto.randomUUID(), accessCount: 0 },
    ])
  }

  function handleDelete(id: string) {
    setLinks((current) => current.filter((link) => link.id !== id))
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
