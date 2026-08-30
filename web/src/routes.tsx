import { createBrowserRouter } from 'react-router-dom'
import { Home } from './pages/home'
import { NotFound } from './pages/not-found'
import { Redirect } from './pages/redirect'

// A ordem aqui é só legibilidade: o router escolhe por score, não por posição.
// `/:shortUrl` (6) vence o catch-all (-2 de penalidade) em `/slug`, e não casa
// com `/` porque o segmento dinâmico exige ao menos um caractere. Sobra para o
// `*` só o que tem mais de um segmento (`/a/b`).
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/:shortUrl',
    element: <Redirect />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
])
