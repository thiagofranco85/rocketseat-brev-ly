import { createBrowserRouter } from 'react-router-dom'
import { Home } from './pages/home'
import { NotFound } from './pages/not-found'
import { Redirect } from './pages/redirect'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/redirect',
    element: <Redirect originalUrl='/' />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
])
