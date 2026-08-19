import { useState, type FormEvent } from 'react'
import { SHORT_LINK_HOST } from '../config'
import type { Link } from '../types/link'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Input } from './ui/input'

type NewLinkFormProps = {
  onCreate: (link: Omit<Link, 'id' | 'accessCount'>) => void
}

export function NewLinkForm({ onCreate }: NewLinkFormProps) {
  const [originalUrl, setOriginalUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')

  const isEmpty = !originalUrl.trim() || !shortUrl.trim()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isEmpty) return

    onCreate({ originalUrl: originalUrl.trim(), shortUrl: shortUrl.trim() })
    setOriginalUrl('')
    setShortUrl('')
  }

  return (
    <Card>
      <h2 className="text-lg text-gray-600">Novo link</h2>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
        <Input
          label="Link original"
          placeholder="www.exemplo.com.br"
          value={originalUrl}
          onChange={(event) => setOriginalUrl(event.target.value)}
        />

        <Input
          label="Link encurtado"
          placeholder={`${SHORT_LINK_HOST}/`}
          value={shortUrl}
          onChange={(event) => setShortUrl(event.target.value)}
        />

        <Button type="submit" disabled={isEmpty} className="mt-2">
          Salvar link
        </Button>
      </form>
    </Card>
  )
}
