import {
  CheckCircleIcon,
  InfoIcon,
  WarningIcon,
  XCircleIcon,
} from '@phosphor-icons/react'
import type { ComponentProps } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

const cardInfo = tv({
  base: 'fixed right-3 bottom-3 z-50 flex w-[340px] max-w-[calc(100vw-24px)] animate-card-info items-center gap-3 rounded-lg p-4 shadow-lg shadow-gray-600/10 lg:right-5 lg:bottom-5',
  variants: {
    // A cor fica no elemento externo: título e descrição herdam o tom da
    // variante, como no layout. `info` usa o azul da marca — o Style Guide não
    // tem uma cor de "info" própria.
    variant: {
      info: 'bg-info-surface text-blue-base',
      danger: 'bg-danger-surface text-danger',
      warning: 'bg-warning-surface text-warning',
      success: 'bg-success-surface text-success',
    },
  },
  defaultVariants: {
    variant: 'info',
  },
})

export type CardInfoVariant = NonNullable<
  VariantProps<typeof cardInfo>['variant']
>

const variantIcon = {
  info: InfoIcon,
  danger: XCircleIcon,
  warning: WarningIcon,
  success: CheckCircleIcon,
}

type CardInfoProps = ComponentProps<'div'> & {
  variant?: CardInfoVariant
  title: string
  description: string
}

export function CardInfo({
  variant = 'info',
  title,
  description,
  className,
  ...props
}: CardInfoProps) {
  const Icon = variantIcon[variant]

  return (
    <div
      // `status`/`polite` e não `alert`: o card confirma uma ação que o próprio
      // usuário acabou de disparar, então não deve interromper a leitura.
      role="status"
      aria-live="polite"
      className={cardInfo({ variant, className })}
      {...props}
    >
      <Icon size={20} weight="fill" className="shrink-0" />

      <div className="flex min-w-0 flex-col gap-1">
        <strong className="text-md">{title}</strong>
        <span className="text-sm">{description}</span>
      </div>
    </div>
  )
}
