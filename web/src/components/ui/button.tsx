import { SpinnerIcon } from '@phosphor-icons/react'
import type { ComponentProps, ReactNode } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

const button = tv({
  base: 'flex cursor-pointer items-center justify-center border border-transparent transition-colors disabled:cursor-not-allowed disabled:opacity-50',
  variants: {
    variant: {
      primary:
        'h-12 w-full rounded-lg bg-blue-base px-5 text-md text-white not-disabled:hover:bg-blue-dark',
      secondary:
        'h-8 gap-1.5 rounded bg-gray-200 px-2 text-sm font-semibold text-gray-500 not-disabled:hover:border-blue-base',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
})

type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof button> & {
    icon?: ReactNode
    loading?: boolean
  }

export function Button({
  variant,
  icon,
  loading,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={button({ variant, className })}
      // Sem isto, o duplo clique dispara dois POST e o segundo volta 409 por
      // causa do UNIQUE de short_url.
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <SpinnerIcon size={20} className="animate-spin" />
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  )
}
