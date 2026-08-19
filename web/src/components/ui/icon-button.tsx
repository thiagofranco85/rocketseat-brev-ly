import type { ComponentProps, ReactNode } from 'react'
import { tv } from 'tailwind-variants'

const iconButton = tv({
  base: 'flex size-8 shrink-0 cursor-pointer items-center justify-center rounded border border-transparent bg-gray-200 text-gray-600 transition-colors not-disabled:hover:border-blue-base disabled:cursor-not-allowed disabled:opacity-50',
})

type IconButtonProps = ComponentProps<'button'> & {
  icon: ReactNode
  /** Obrigatório: o botão não tem texto visível. */
  'aria-label': string
}

export function IconButton({ icon, className, ...props }: IconButtonProps) {
  return (
    <button type="button" className={iconButton({ className })} {...props}>
      {icon}
    </button>
  )
}
