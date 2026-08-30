import { useQuery } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import logoIcon from '../assets/logo-icon.svg'
import { Card } from '../components/ui/card'
import { SHORT_LINK_HOST } from '../config'
import { isApiError } from '../http/client'
import { getLinkByShortUrl } from '../http/links'
import { NotFound } from './not-found'

const linkClassName = 'text-blue-base underline hover:text-blue-dark'

type MessageCardProps = {
  title: string
  children: ReactNode
}

function MessageCard({ title, children }: MessageCardProps) {
  return (
    <main className="flex min-h-screen items-center justify-center px-3 lg:px-0">
      <Card className="flex w-full max-w-[580px] flex-col items-center gap-6 py-12 lg:py-16">
        <img src={logoIcon} alt="" className="size-12" />

        <h1 className="text-center text-xl text-gray-600">{title}</h1>

        {/*
          Dois <p> num div com gap-1, não um parágrafo com quebra de linha: o
          espaçamento medido no Figma entre as frases (22px) é maior que o
          line-height normal (18px).
        */}
        <div className="flex flex-col gap-1 text-center text-md font-normal text-gray-500">
          {children}
        </div>
      </Card>
    </main>
  )
}

export function Redirect() {
  const { shortUrl } = useParams<{ shortUrl: string }>()

  const { data, error } = useQuery({
    queryKey: ['link', shortUrl],
    // O `!` é seguro: o segmento dinâmico da rota compila para `([^\/]+)`, que
    // exige ao menos um caractere. Sem parâmetro, esta página nem é montada.
    queryFn: () => getLinkByShortUrl(shortUrl!),
    // O default do React Query é 3 novas tentativas com backoff exponencial:
    // um slug inexistente ficaria ~7s em "Redirecionando..." antes de mostrar
    // o 404. Custo aceito: falha de rede também não é repetida — numa página
    // cujo único trabalho é sair dela, falhar na hora é melhor que esperar.
    retry: false,
  })

  const originalUrl = data?.originalUrl

  // `replace` e não `href`: com `href`, o botão Voltar traz o usuário de volta
  // para cá e ele é mandado ao destino de novo. `window.location` e não
  // `<Navigate>` porque o destino é externo ao SPA.
  useEffect(() => {
    if (originalUrl) {
      window.location.replace(originalUrl)
    }
  }, [originalUrl])

  // Discriminar pelo `code`, não pelo status: quando o corpo do erro não é
  // JSON, o cliente devolve `UNEXPECTED_RESPONSE` mantendo o status original.
  // Um 404 vindo de outro lugar não é link inexistente.
  if (isApiError(error) && error.code === 'LINK_NOT_FOUND') {
    return <NotFound />
  }

  if (error) {
    return (
      <MessageCard title="Não foi possível redirecionar">
        <p>O servidor não respondeu. Verifique sua conexão e tente de novo.</p>
        <p>
          Ou volte para{' '}
          <a href="/" className={linkClassName}>
            {SHORT_LINK_HOST}
          </a>
          .
        </p>
      </MessageCard>
    )
  }

  return (
    <MessageCard title="Redirecionando...">
      <p>O link será aberto automaticamente em alguns instantes.</p>

      {/*
        O link de escape só aparece quando já existe destino. Renderizá-lo
        durante o carregamento produziria um <a> sem href — com cara de link,
        sem agir como um.
      */}
      {originalUrl && (
        <p>
          Não foi redirecionado?{' '}
          <a href={originalUrl} className={linkClassName}>
            Acesse aqui
          </a>
        </p>
      )}
    </MessageCard>
  )
}
