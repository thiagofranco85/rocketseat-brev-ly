import { QueryClient } from '@tanstack/react-query'

// Fora do componente: instanciar dentro do App recriaria o cache a cada render.
export const queryClient = new QueryClient()
