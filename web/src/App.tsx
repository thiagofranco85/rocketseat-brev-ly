import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { CardInfoProvider } from './components/card-info-provider'
import { queryClient } from './lib/query-client'
import { router } from './routes'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* O provider fica dentro da div para o card herdar a `font-sans`. */}
      <div className="min-h-screen min-w-[320px] bg-gray-200 font-sans">
        <CardInfoProvider>
          <RouterProvider router={router} />
        </CardInfoProvider>
      </div>
    </QueryClientProvider>
  )
}

export default App
