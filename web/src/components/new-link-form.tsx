import { zodResolver } from '@hookform/resolvers/zod'
import { WarningIcon } from '@phosphor-icons/react'
import { useEffect, useRef } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { SHORT_LINK_HOST } from '../config'
import { isApiError } from '../http/client'
import { generateShortUrl } from '../lib/generate-short-url'
import { newLinkSchema, type NewLinkFormData } from '../schemas/new-link'
import type { NewLink } from '../types/link'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Input } from './ui/input'

type NewLinkFormProps = {
  onCreate: (link: NewLink) => Promise<void>
}

type FieldError = {
  field: 'originalUrl' | 'shortUrl'
  message: string
}

// O backend valida um erro por vez e devolve um `code` estável. Cada código
// aponta para o campo que o usuário precisa corrigir; o resto (500, payload
// inválido, rede fora) não tem campo culpado e vira erro de formulário.
const errorByCode: Record<string, FieldError> = {
  INVALID_ORIGINAL_URL: {
    field: 'originalUrl',
    message: 'Informe uma URL válida.',
  },
  INVALID_SHORT_URL: {
    field: 'shortUrl',
    message: 'Formato inválido para o link encurtado.',
  },
  SHORT_URL_ALREADY_EXISTS: {
    field: 'shortUrl',
    message: 'Esse link encurtado já está em uso.',
  },
}

const GENERIC_ERROR = 'Não foi possível salvar o link. Tente novamente.'

export function NewLinkForm({ onCreate }: NewLinkFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    getValues,
    control,
    formState: { errors, isSubmitting },
  } = useForm<NewLinkFormData>({
    resolver: zodResolver(newLinkSchema),
    defaultValues: { originalUrl: '', shortUrl: '' },
  })

  // O Figma mostra "Salvar link" desabilitado com os campos vazios. É o hook
  // `useWatch`, e não o `watch()` do useForm, porque o `watch()` devolve uma
  // função que o React Compiler não consegue memoizar — ele desistiria de
  // memoizar o componente inteiro.
  const [originalUrl, shortUrl] = useWatch({
    control,
    name: ['originalUrl', 'shortUrl'],
  })
  const isEmpty = !originalUrl?.trim() || !shortUrl?.trim()

  // Preenche "Link encurtado" a cada tecla digitada em "Link original". A ref
  // guarda o último valor gerado automaticamente: só sobrescreve o campo
  // enquanto ele ainda tiver esse valor. Assim, depois de uma edição manual do
  // slug, ele para de ser sobrescrito nas teclas seguintes.
  const lastGeneratedShortUrl = useRef('')

  useEffect(() => {
    const generated = generateShortUrl(originalUrl ?? '')

    if (
      getValues('shortUrl') === lastGeneratedShortUrl.current &&
      generated !== getValues('shortUrl')
    ) {
      setValue('shortUrl', generated, {
        shouldValidate: true,
        shouldDirty: true,
      })
    }

    lastGeneratedShortUrl.current = generated
  }, [originalUrl, getValues, setValue])

  async function handleCreate(data: NewLinkFormData) {
    try {
      await onCreate({
        originalUrl: data.originalUrl.trim(),
        shortUrl: data.shortUrl.trim(),
      })

      reset()
    } catch (error) {
      const fieldError = isApiError(error) ? errorByCode[error.code] : undefined

      if (fieldError) {
        setError(fieldError.field, { message: fieldError.message })
        return
      }

      setError('root', { message: GENERIC_ERROR })
    }
  }

  return (
    <Card>
      <h2 className="text-lg text-gray-600">Novo link</h2>

      <form
        onSubmit={handleSubmit(handleCreate)}
        className="mt-6 flex flex-col gap-5"
      >
        <Input
          label="Link original"
          placeholder="www.exemplo.com.br"
          error={errors.originalUrl?.message}
          {...register('originalUrl')}
        />

        {/*
          O host é prefixo fixo, não placeholder: fica visível enquanto o
          usuário digita e não pode ser apagado. Sem `placeholder` aqui, senão
          o campo vazio mostraria o host duas vezes.
        */}
        <Input
          label="Link encurtado"
          prefixText={`${SHORT_LINK_HOST}/`}
          error={errors.shortUrl?.message}
          {...register('shortUrl')}
        />

        {/*
          O estado de envio vem do `isSubmitting` da RHF, não do `isPending` da
          mutation. O `isPending` só fica true depois do resolver assíncrono da
          validação, e um duplo clique chega antes disso — o segundo POST volta
          409 por causa do UNIQUE de short_url. O `isSubmitting` é marcado no
          início do handleSubmit, antes de qualquer await.
        */}
        <Button
          type="submit"
          disabled={isEmpty}
          loading={isSubmitting}
          className="mt-2"
        >
          Salvar link
        </Button>

        {errors.root && (
          <p
            role="alert"
            className="flex items-center gap-2 text-sm text-gray-500"
          >
            <WarningIcon size={16} className="shrink-0 text-danger" />
            {errors.root.message}
          </p>
        )}
      </form>
    </Card>
  )
}
