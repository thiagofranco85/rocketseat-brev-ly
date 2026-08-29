import { env } from '../env'

type ApiErrorBody = {
  code: string
  message: string
}

/**
 * Erro montado a partir do envelope `{ code, message }` do backend.
 *
 * Os campos são atribuídos no corpo do construtor porque `erasableSyntaxOnly`
 * proíbe parameter property. O `setPrototypeOf` é o que mantém a cadeia de
 * protótipos intacta depois do downlevel.
 */
export class ApiError extends Error {
  code: string
  status: number

  constructor(body: ApiErrorBody, status: number) {
    super(body.message)

    Object.setPrototypeOf(this, ApiError.prototype)

    this.name = 'ApiError'
    this.code = body.code
    this.status = status
  }
}

/**
 * Checagem estrutural em vez de `instanceof`: se a cadeia de protótipos quebrar
 * num edge de bundler, um 409 cairia no erro genérico em silêncio e a mensagem
 * "já está em uso" nunca chegaria ao campo.
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    typeof (error as ApiError).code === 'string' &&
    typeof (error as ApiError).status === 'number'
  )
}

async function readErrorBody(response: Response): Promise<ApiErrorBody> {
  try {
    return await response.json()
  } catch {
    return {
      code: 'UNEXPECTED_RESPONSE',
      message: `Resposta inesperada do servidor (${response.status}).`,
    }
  }
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${env.VITE_BACKEND_URL}${path}`, {
    ...init,
    // O error handler do backend ignora o `statusCode` do Fastify: sem este
    // header, o POST volta 500 em vez de 415 e o erro fica indecifrável.
    headers: init?.body
      ? { 'Content-Type': 'application/json', ...init.headers }
      : init?.headers,
  })

  if (!response.ok) {
    throw new ApiError(await readErrorBody(response), response.status)
  }

  // O DELETE responde 204 sem corpo, e `json()` estouraria.
  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}
