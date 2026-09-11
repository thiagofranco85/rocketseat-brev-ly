import cors from '@fastify/cors'
import Fastify from 'fastify'
import { errorHandler } from './error-handler.ts'
import { routes } from './routes.ts'

export function buildApp() {
  const app = Fastify({ logger: true })

  // O default do @fastify/cors é `GET,HEAD,POST`, então o preflight reprovava
  // DELETE e PATCH e as duas rotas ficavam inalcançáveis pelo browser.
  app.register(cors, {
    origin: true,
    methods: ['GET', 'HEAD', 'POST', 'PATCH', 'DELETE'],
  })

  app.setErrorHandler(errorHandler)
  app.register(routes)

  return app
}
