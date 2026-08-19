import type { ComponentProps } from 'react'
import { tv } from 'tailwind-variants'

const card = tv({
  base: 'rounded-lg bg-gray-100 p-6 lg:p-8',
})

export function Card({ className, ...props }: ComponentProps<'div'>) {
  return <div className={card({ className })} {...props} />
}
