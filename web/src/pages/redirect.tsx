import { useMutation } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import logoIcon from '../assets/logo-icon.svg'
import { Card } from '../components/ui/card'
import { SHORT_LINK_HOST } from '../config'
import { isApiError } from '../http/client'
import { incrementAccessCount } from '../http/links'
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

  // Qual slug esta instância da página já contou. Em desenvolvimento o
  // StrictMode monta, desmonta e monta de novo: sem a trava, um acesso só
  // viraria dois no banco. Guardar o slug, e não um booleano, mantém a trava
  // correta se a rota trocar de parâmetro sem remontar o componente.
  const countedShortUrl = useRef<string | null>(null)

  // `useMutation` porque a chamada escreve: ela soma 1 no contador. O valor de
  // volta é o link já atualizado, então o destino do redirecionamento sai
  // daqui mesmo — uma requisição só, como no `useQuery` de antes.
  //
  // Sem `retry`: o padrão de uma mutation é não repetir, e aqui isso é
  // correção, não velocidade. Uma resposta perdida depois de o servidor já ter
  // somado faria a nova tentativa somar de novo.
  const { data, error, mutate } = useMutation({
    mutationFn: incrementAccessCount,
  })

  // Contar antes de sair da página, não junto: o `location.replace` abaixo
  // pode fazer o navegador cancelar uma requisição ainda em voo, e aí o acesso
  // se perderia. Por isso o redirecionamento só acontece com a resposta na mão.
  //
  // O `!` é seguro: o segmento dinâmico da rota compila para `([^\/]+)`, que
  // exige ao menos um caractere. Sem parâmetro, esta página nem é montada.
  useEffect(() => {
    if (countedShortUrl.current === shortUrl) return

    countedShortUrl.current = shortUrl!
    mutate(shortUrl!)
  }, [shortUrl, mutate])

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
