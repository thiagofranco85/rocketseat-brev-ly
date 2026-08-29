import cors from '@fastify/cors'
import Fastify from 'fastify'
import { errorHandler } from './error-handler.ts'
import { routes } from './routes.ts'

export function buildApp() {
  const app = Fastify({ logger: true })

  // Sem `exposedHeaders`, o browser bloqueia a leitura do Content-Disposition
  // em requisição cross-origin e o CSV baixa com o nome errado.
  app.register(cors, {
    origin: true,
    exposedHeaders: ['Content-Disposition'],
  })

  app.setErrorHandler(errorHandler)
  app.register(routes)

  return app
}
