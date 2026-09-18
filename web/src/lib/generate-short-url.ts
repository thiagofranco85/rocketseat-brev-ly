const PROTOCOL_PATTERN = /^https?:\/\//i
const SHORT_URL_LENGTH = 8
const FNV_OFFSET_BASIS = 0x811c9dc5
const FNV_PRIME = 0x01000193

/**
 * Gera um slug de 8 caracteres (letras minúsculas e números) a partir do
 * domínio principal e dos parâmetros (caminho + query string) da URL
 * original.
 *
 * É determinístico: a mesma URL original sempre produz o mesmo slug, e URLs
 * diferentes só compartilham domínio ou só compartilham parâmetros, nunca os
 * dois, então o hash sempre muda. Isso permite chamar a função a cada tecla
 * digitada, sem o preview "piscar" para um valor diferente a cada render.
 */
export function generateShortUrl(rawOriginalUrl: string): string {
  const { mainDomain, params } = splitOriginalUrl(rawOriginalUrl)

  if (!mainDomain) {
    return ''
  }

  const hash = hashDigits(params, hashDigits(mainDomain, FNV_OFFSET_BASIS))

  return toBase36Slug(hash, SHORT_URL_LENGTH)
}

function splitOriginalUrl(rawOriginalUrl: string): {
  mainDomain: string
  params: string
} {
  const trimmed = rawOriginalUrl.trim()

  if (!trimmed) {
    return { mainDomain: '', params: '' }
  }

  const withProtocol = PROTOCOL_PATTERN.test(trimmed)
    ? trimmed
    : `https://${trimmed}`

  try {
    const url = new URL(withProtocol)

    return {
      mainDomain: getMainDomain(url.hostname),
      params: `${url.pathname}${url.search}`,
    }
  } catch {
    // URL ainda incompleta enquanto o usuário digita (ex.: "www.ex a").
    // Usa o texto cru como domínio para o preview continuar reagindo.
    return { mainDomain: trimmed, params: '' }
  }
}

/** `www.exemplo.com.br` vira `exemplo`; `github.com` vira `github`. */
function getMainDomain(hostname: string): string {
  const labels = hostname.split('.').filter(Boolean)
  const withoutWww = labels[0] === 'www' ? labels.slice(1) : labels

  return withoutWww[0] ?? hostname
}

/**
 * FNV-1a: percorre os dígitos (código de cada caractere) do texto e vai
 * misturando no hash. `seed` encadeia domínio e parâmetros num único hash de
 * 32 bits sem precisar concatenar as strings.
 */
function hashDigits(text: string, seed: number): number {
  let hash = seed

  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i)
    hash = Math.imul(hash, FNV_PRIME)
  }

  return hash >>> 0
}

/** Espalha o hash em `length` dígitos base36 (0-9a-z) via LCG. */
function toBase36Slug(seed: number, length: number): string {
  let state = seed >>> 0
  let slug = ''

  for (let i = 0; i < length; i++) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    slug += (state % 36).toString(36)
  }

  return slug
}
