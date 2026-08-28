import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import { ZodError } from 'zod'
import { DomainError } from './entities/errors.ts'

const statusByCode: Record<string, number | undefined> = {
  INVALID_SHORT_URL: 400,
  INVALID_ORIGINAL_URL: 400,
  SHORT_URL_ALREADY_EXISTS: 409,
  LINK_NOT_FOUND: 404,
}

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      code: 'VALIDATION_ERROR',
      message: 'Invalid request payload.',
      issues: error.issues,
    })
  }

  if (error instanceof DomainError) {
    return reply.status(statusByCode[error.code] ?? 400).send({
      code: error.code,
      message: error.message,
    })
  }

  request.log.error(error)

  // Body genérico de propósito: `error.message` de erro desconhecido pode
  // carregar detalhe de conexão do banco.
  return reply.status(500).send({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Internal server error.',
  })
}
