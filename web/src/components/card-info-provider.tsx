import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import { CardInfoContext, type CardInfoMessage } from '../contexts/card-info'
import { CardInfo } from './ui/card-info'

type ShownCardInfo = CardInfoMessage & { id: number }

export function CardInfoProvider({ children }: { children: ReactNode }) {
  const [card, setCard] = useState<ShownCardInfo | null>(null)
  const lastId = useRef(0)

  const showCardInfo = useCallback((message: CardInfoMessage) => {
    lastId.current += 1
    setCard({ ...message, id: lastId.current })
  }, [])

  // Sem o `useMemo`, cada card exibido criaria um objeto novo e re-renderizaria
  // todo mundo que consome o contexto, não só o card.
  const value = useMemo(() => ({ showCardInfo }), [showCardInfo])

  return (
    <CardInfoContext value={value}>
      {children}

      {card && (
        <CardInfo
          // `id` novo a cada chamada: o `key` remonta o card e a animação
          // recomeça do zero quando o mesmo botão é clicado duas vezes seguidas.
          key={card.id}
          variant={card.variant}
          title={card.title}
          description={card.description}
          // Quem tira o card da tela é o fim da animação. Um `setTimeout` de 5s
          // em paralelo cortaria o fade-out no último quadro.
          //
          // A comparação de `id` cobre o clique que cai exatamente no fim da
          // animação anterior: sem ela, os dois `setCard` entram no mesmo lote
          // e o `null` apagaria o card que acabou de ser pedido.
          onAnimationEnd={() =>
            setCard((current) => (current?.id === card.id ? null : current))
          }
        />
      )}
    </CardInfoContext>
  )
}
