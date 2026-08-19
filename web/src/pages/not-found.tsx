import notFoundIllustration from '../assets/not-found.svg'
import { Card } from '../components/ui/card'
import { SHORT_LINK_HOST } from '../config'

export function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-3 lg:px-0">
      <Card className="flex w-full max-w-[580px] flex-col items-center gap-6 py-12 lg:py-16">
        <img
          src={notFoundIllustration}
          alt=""
          className="w-[164px] lg:w-[194px]"
        />

        <h1 className="text-center text-xl text-gray-600">
          Link não encontrado
        </h1>

        {/* Largura travada: é ela que reproduz a quebra de linha do layout. */}
        <p className="max-w-[460px] text-center text-md font-normal text-gray-500">
          O link que você está tentando acessar não existe, foi removido ou é
          uma URL inválida. Saiba mais em{' '}
          <a
            href="/"
            className="font-semibold text-blue-base underline hover:text-blue-dark"
          >
            {SHORT_LINK_HOST}
          </a>
          .
        </p>
      </Card>
    </main>
  )
}
