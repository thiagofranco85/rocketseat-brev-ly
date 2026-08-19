import { WarningIcon } from '@phosphor-icons/react'
import { useId, type ComponentProps } from 'react'
import { tv } from 'tailwind-variants'

const input = tv({
  slots: {
    root: 'group flex flex-col gap-2',
    label: 'text-xs uppercase transition-colors',
    field:
      'h-12 w-full rounded-lg border px-4 text-md font-normal text-gray-600 transition-colors outline-none placeholder:text-gray-400',
    message: 'flex items-center gap-2 text-sm text-gray-500',
  },
  variants: {
    invalid: {
      true: {
        label: 'font-bold text-danger',
        field: 'border-[1.5px] border-danger',
      },
      false: {
        label:
          'text-gray-500 group-focus-within:font-bold group-focus-within:text-blue-base',
        field: 'border-gray-300 focus:border-[1.5px] focus:border-blue-base',
      },
    },
  },
})

type InputProps = ComponentProps<'input'> & {
  label: string
  error?: string
}

export function Input({ label, error, id, className, ...props }: InputProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const errorId = `${fieldId}-error`

  const styles = input({ invalid: !!error })

  return (
    <div className={styles.root({ className })}>
      <label htmlFor={fieldId} className={styles.label()}>
        {label}
      </label>

      <input
        id={fieldId}
        className={styles.field()}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />

      {error && (
        <p id={errorId} className={styles.message()}>
          <WarningIcon size={16} className="shrink-0 text-danger" />
          {error}
        </p>
      )}
    </div>
  )
}
