import { WarningIcon } from '@phosphor-icons/react'
import { useId, type ComponentProps, type MouseEvent } from 'react'
import { tv } from 'tailwind-variants'

// A borda e o anel de foco ficam no `field`, que é a <div> em volta do campo,
// e não no <input>. É o que permite o prefixo ficar dentro da mesma caixa.
// Por isso o foco é `focus-within`: ele nasce em um filho, não no elemento
// que desenha a borda.
const input = tv({
  slots: {
    root: 'group flex flex-col gap-2',
    label: 'text-xs uppercase transition-colors',
    field:
      'flex h-12 w-full items-center rounded-lg border px-4 transition-colors',
    // `font-normal` porque o tema dá peso 600 ao `text-md`. Sem ele o prefixo
    // sairia mais grosso que o texto digitado ao lado.
    prefix: 'shrink-0 select-none text-md font-normal text-gray-400',
    control:
      'min-w-0 flex-1 border-0 bg-transparent p-0 text-md font-normal text-gray-600 outline-none placeholder:text-gray-400',
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
        field:
          'border-gray-300 focus-within:border-[1.5px] focus-within:border-blue-base',
      },
    },
  },
})

type InputProps = ComponentProps<'input'> & {
  label: string
  error?: string
  /**
   * Texto fixo exibido antes do campo, dentro da mesma borda.
   *
   * Não se chama `prefix` porque esse nome já existe em `HTMLAttributes` (é um
   * atributo RDFa). Com ele, esquecer de tirá-lo do spread não daria erro de
   * compilação — a string vazaria para o DOM em silêncio.
   */
  prefixText?: string
}

export function Input({
  label,
  error,
  prefixText,
  id,
  className,
  ...props
}: InputProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const errorId = `${fieldId}-error`

  const styles = input({ invalid: !!error })

  // Com o padding lateral na <div>, clicar na margem interna (ou no prefixo)
  // deixaria de focar o campo. Este handler devolve esse comportamento.
  //
  // É `querySelector` e não `useRef` de propósito: o `register()` da RHF manda
  // uma `ref` pelo spread de props e, no React 19, `ref` é prop comum — um
  // `ref` nosso no mesmo <input> sobrescreveria a dela sem erro nenhum.
  function handleMouseDown(event: MouseEvent<HTMLDivElement>) {
    // Clique no próprio input segue o caminho normal. O preventDefault abaixo
    // mataria o posicionamento do cursor no meio do texto.
    if (event.target instanceof HTMLInputElement) return

    event.preventDefault()
    event.currentTarget.querySelector('input')?.focus()
  }

  return (
    <div className={styles.root({ className })}>
      <label htmlFor={fieldId} className={styles.label()}>
        {label}
      </label>

      <div className={styles.field()} onMouseDown={handleMouseDown}>
        {/*
          O prefixo é um <span>, e não parte do `value` do input. Como ele
          nunca esteve no valor, não existe edição que o alcance: nem Ctrl+A +
          Delete, nem Home + Backspace, nem colagem por cima da seleção. E o
          que sai para a validação e para a API continua sendo só o que o
          usuário digitou.
        */}
        {prefixText && <span className={styles.prefix()}>{prefixText}</span>}

        <input
          id={fieldId}
          className={styles.control()}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          {...props}
        />
      </div>

      {error && (
        <p id={errorId} className={styles.message()}>
          <WarningIcon size={16} className="shrink-0 text-danger" />
          {error}
        </p>
      )}
    </div>
  )
}
