import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { queryClient } from './lib/query-client'
import { router } from './routes'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen min-w-[320px] bg-gray-200 font-sans">
        <RouterProvider router={router} />
      </div>
    </QueryClientProvider>
  )
}

export default App
