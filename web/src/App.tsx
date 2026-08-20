import { RouterProvider } from 'react-router-dom'
import { router } from './routes'

function App() {
  return (
    <div className="min-h-screen min-w-[320px] bg-gray-200 font-sans">
      <RouterProvider router={router} />
    </div>
  )
}

export default App
