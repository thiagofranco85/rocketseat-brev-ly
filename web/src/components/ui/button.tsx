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
  }

export function Button({
  variant,
  icon,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button type="button" className={button({ variant, className })} {...props}>
      {icon}
      {children}
    </button>
  )
}
