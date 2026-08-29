import type { Link } from '../types/link'

/**
 * Dados de exemplo do layout do Figma, até a API existir.
 *
 * Os valores imitam o que a API devolve, não o que o Figma mostra:
 * `shortUrl` em minúsculo e `originalUrl` com protocolo. O backend normaliza
 * os dois antes de gravar, e um mock divergente esconderia a diferença até
 * a hora da integração.
 */
export const mockLinks: Link[] = [
  {
    id: '1',
    shortUrl: 'portfolio-dev',
    originalUrl: 'https://devsite.portfolio.com.br/devname-123456',
    accessCount: 30,
    createdAt: '2026-08-24T13:10:00.000Z',
  },
  {
    id: '2',
    shortUrl: 'linkedin-profile',
    originalUrl: 'https://linkedin.com/in/myprofile',
    accessCount: 15,
    createdAt: '2026-08-25T09:42:00.000Z',
  },
  {
    id: '3',
    shortUrl: 'github-project',
    originalUrl: 'https://github.com/devname/project-name-v2',
    accessCount: 34,
    createdAt: '2026-08-26T18:05:00.000Z',
  },
  {
    id: '4',
    shortUrl: 'figma-encurtador-de-links',
    originalUrl: 'https://figma.com/design/file/Encurtador-de-Links',
    accessCount: 53,
    createdAt: '2026-08-27T11:30:00.000Z',
  },
]
