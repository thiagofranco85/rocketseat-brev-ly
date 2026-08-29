import { buildApp } from './app.ts'
import { connection } from './db/client.ts'
import { env } from './env.ts'

const app = buildApp()

// Encerramento gracioso. `app.close()` para de aceitar requisição nova e
// espera as que já estão em andamento terminarem, em vez de cortá-las no meio
// da resposta. `connection.end()` avisa o Postgres antes de sair.
//
// Importa em produção: `docker stop` manda SIGTERM e só mata à força 10s depois.
async function shutdown() {
  await app.close()
  await connection.end()
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

app
  .listen({ port: env.PORT, host: '0.0.0.0' })
  .catch((error) => {
    app.log.error(error)
    process.exit(1)
  })
