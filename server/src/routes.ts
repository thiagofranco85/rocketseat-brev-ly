import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { linkCsvExporter, linkService } from './container.ts'

// O Zod valida a forma do payload. A regra de URL e de slug mora na entidade
// `Link`, que é fonte única da validação e da mensagem de erro.
const createLinkBodySchema = z.object({
  originalUrl: z.string(),
  shortUrl: z.string(),
})

const shortUrlParamsSchema = z.object({
  shortUrl: z.string(),
})

/**
 * `request.params` chega como `unknown`, então o parse também é o que dá tipo
 * ao valor — não é validação redundante.
 */
function parseShortUrl(params: unknown): string {
  return shortUrlParamsSchema.parse(params).shortUrl
}

export async function routes(app: FastifyInstance) {
  app.get('/health', async () => ({ status: 'ok' }))

  app.post('/links', async (request, reply) => {
    const body = createLinkBodySchema.parse(request.body)

    return reply.status(201).send(await linkService.create(body))
  })

  app.get('/links', async () => linkService.list())

  app.get('/links/:shortUrl', async (request) =>
    linkService.getByShortUrl(parseShortUrl(request.params)),
  )

  app.patch('/links/:shortUrl/access-count', async (request) =>
    linkService.incrementAccessCount(parseShortUrl(request.params)),
  )

  app.delete('/links/:shortUrl', async (request, reply) => {
    await linkService.delete(parseShortUrl(request.params))

    return reply.status(204).send()
  })

  // POST, e não GET: cada chamada grava um arquivo novo na CDN, com nome
  // aleatório. A resposta traz só o endereço — o CSV em si não passa mais pela
  // API no momento do download.
  app.post('/exports/links', async (_request, reply) => {
    const { fileName, url } = await linkCsvExporter.export()

    return reply.status(201).send({ fileName, url })
  })
}
