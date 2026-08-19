import type { Link } from '../types/link'

/** Dados de exemplo do layout do Figma, até a API existir. */
export const mockLinks: Link[] = [
  {
    id: '1',
    shortUrl: 'Portfolio-Dev',
    originalUrl: 'devsite.portfolio.com.br/devname-123456',
    accessCount: 30,
  },
  {
    id: '2',
    shortUrl: 'Linkedin-Profile',
    originalUrl: 'linkedin.com/in/myprofile',
    accessCount: 15,
  },
  {
    id: '3',
    shortUrl: 'Github-Project',
    originalUrl: 'github.com/devname/project-name-v2',
    accessCount: 34,
  },
  {
    id: '4',
    shortUrl: 'Figma-Encurtador-de-Links',
    originalUrl: 'figma.com/design/file/Encurtador-de-Links',
    accessCount: 53,
  },
]
