import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { tv } from 'tailwind-variants'
import type { Link } from '../types/link'
import { LinkItem } from './link-item'

type LinkListProps = {
  links: Link[]
  onDelete: (shortUrl: string) => void
}

// Distância entre o fim da lista e a borda inferior da janela. No mobile: os
// 24px de padding do card, menos os 11px de margem negativa da lista, mais 32px
// de respiro = 45. No desktop: 32 - 15 + 32 = 49. Um valor só serve aos dois.
const BOTTOM_GUTTER = 48

// Piso de ~2 itens (74 + 1 de divisória + 74). Em janela muito baixa o card
// passa da tela e a página volta a rolar: no mobile o que fica acima da lista já
// ocupa ~492px, então num 320x568 sobrariam 28px — não cabe nem um item. Rolar a
// página é melhor do que uma lista baixa demais para ser usada.
const MIN_LIST_HEIGHT = 150

const list = tv({
  base: '-mb-2.75 divide-y divide-gray-200 overflow-y-auto lg:-mb-3.75 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-blue-base [&::-webkit-scrollbar-track]:bg-transparent',
  variants: {
    // O padding à direita só entra quando há barra de rolagem, senão a lista
    // sairia do alinhamento com o cabeçalho do card.
    hasScroll: {
      true: 'pr-3',
    },
  },
})

export function LinkList({ links, onDelete }: LinkListProps) {
  const listRef = useRef<HTMLUListElement>(null)

  const [layout, setLayout] = useState({
    maxHeight: MIN_LIST_HEIGHT,
    hasScroll: false,
  })

  // O teto de altura vem do espaço que sobra na janela abaixo do topo da lista,
  // e não de uma quantidade fixa de links: cada usuário vê tantos itens quanto a
  // janela dele comporta.
  const measure = useCallback(() => {
    const element = listRef.current

    if (!element) return

    // `top + scrollY` é a posição no documento, não na janela. Com o `top` puro,
    // rolar a página no mobile mudaria o teto no meio da rolagem.
    const documentTop = element.getBoundingClientRect().top + window.scrollY
    const available = window.innerHeight - documentTop - BOTTOM_GUTTER
    const maxHeight = Math.max(available, MIN_LIST_HEIGHT)

    // `scrollHeight` é a altura do conteúdo e não depende do teto aplicado — a
    // lista é `height: auto`, apenas limitada pelo `max-height`. Por isso o teto
    // e a existência da barra saem da mesma medição, sem render intermediário.
    const hasScroll = element.scrollHeight > maxHeight

    // Devolver o mesmo objeto quando nada mudou é o que corta o ciclo: este
    // estado muda a altura da lista, que muda a do `body`, que acorda o
    // ResizeObserver lá embaixo.
    setLayout((current) =>
      current.maxHeight === maxHeight && current.hasScroll === hasScroll
        ? current
        : { maxHeight, hasScroll },
    )
  }, [])

  // Sem array de dependências: remede a cada render. É o que cobre a entrada e a
  // saída de links, que mudam a altura do conteúdo sem mudar a do `body` — o
  // `App` é `min-h-screen`, então enquanto tudo couber na tela o observer abaixo
  // não tem nada para notificar.
  useLayoutEffect(measure)

  useEffect(() => {
    const element = listRef.current

    if (!element) return

    window.addEventListener('resize', measure)

    // Observa o <main>, e não o `body`: o `body` fica preso na altura da janela
    // enquanto o conteúdo couber nela, por causa do `min-h-screen` do App, e aí
    // nunca notifica nada. Já o <main> acompanha o conteúdo. O caso real é o
    // formulário crescendo com uma mensagem de erro no mobile: ele empurra a
    // lista 24px para baixo sem disparar `resize` nenhum.
    //
    // Nunca observar o próprio <ul>: observar o elemento cuja altura este
    // componente define é o que dispara o "ResizeObserver loop completed with
    // undelivered notifications".
    const container = element.closest('main') ?? document.body

    const observer = new ResizeObserver(measure)
    observer.observe(container)

    return () => {
      window.removeEventListener('resize', measure)
      observer.disconnect()
    }
  }, [measure])

  return (
    <ul
      ref={listRef}
      style={{ maxHeight: layout.maxHeight }}
      className={list({ hasScroll: layout.hasScroll })}
    >
      {links.map((link) => (
        <LinkItem key={link.shortUrl} link={link} onDelete={onDelete} />
      ))}
    </ul>
  )
}
