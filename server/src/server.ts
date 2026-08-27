import { buildApp } from './app.ts'
import { env } from './env.ts'

const app = buildApp()

app
  .listen({ port: env.PORT, host: '0.0.0.0' })
  .catch((error) => {
    app.log.error(error)
    process.exit(1)
  })
