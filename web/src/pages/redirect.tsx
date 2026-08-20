import logoIcon from '../assets/logo-icon.svg'
import { Card } from '../components/ui/card'

type RedirectProps = {
  /** URL de destino, exibida no link de escape enquanto o redirecionamento não acontece. */
  originalUrl: string
}

export function Redirect({ originalUrl }: RedirectProps) {
  return (
    <main className="flex min-h-screen items-center justify-center px-3 lg:px-0">
      <Card className="flex w-full max-w-[580px] flex-col items-center gap-6 py-12 lg:py-16">
        <img src={logoIcon} alt="" className="size-12" />

        <h1 className="text-center text-xl text-gray-600">Redirecionando...</h1>

        <div className="flex flex-col gap-1 text-center text-md font-normal text-gray-500">
          <p>O link será aberto automaticamente em alguns instantes.</p>
          <p>
            Não foi redirecionado?{' '}
            <a
              href={originalUrl}
              className="text-blue-base underline hover:text-blue-dark"
            >
              Acesse aqui
            </a>
          </p>
        </div>
      </Card>
    </main>
  )
}
