import { createContext, useContext } from 'react'
import type { CardInfoVariant } from '../components/ui/card-info'

export type CardInfoMessage = {
  variant?: CardInfoVariant
  title: string
  description: string
}

type CardInfoContextValue = {
  showCardInfo: (message: CardInfoMessage) => void
}

export const CardInfoContext = createContext<CardInfoContextValue | null>(null)

/**
 * Mostra o card de feedback no canto inferior direito, de qualquer ponto da
 * árvore. Separado de `card-info-provider.tsx` porque o `react-refresh` só
 * preserva o estado de arquivos que exportam apenas componentes.
 */
export function useCardInfo() {
  const context = useContext(CardInfoContext)

  if (!context) {
    throw new Error('useCardInfo precisa estar dentro de <CardInfoProvider>.')
  }

  return context
}
