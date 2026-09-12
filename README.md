# Brev.ly

Encurtador de URL full stack. Cadastra, lista e remove links encurtados, conta os acessos de cada um, redireciona o link curto para a URL original e exporta o relatório em CSV para uma CDN.

Projeto do desafio Full Stack da Rocketseat.

## Funcionalidades

- Criar link curto com slug escolhido pelo usuário (`brev.ly/portfolio-dev`).
- Bloquear slug mal formatado (3 a 64 caracteres, minúsculas, números e hífen) e slug já existente.
- Listar todos os links, do mais recente para o mais antigo.
- Excluir link.
- Redirecionar o slug para a URL original, contando o acesso na mesma requisição.
- Exportar todos os links em CSV, com upload para o Cloudflare R2 e download direto da CDN.
- Página "Não encontrado" quando o slug não existe.

## Stack

**Backend** — TypeScript, Fastify, Drizzle ORM, Postgres 18, Zod, AWS SDK S3 (cliente do Cloudflare R2), Docker.

**Frontend** — TypeScript, React 19, Vite, TailwindCSS 4, React Query, React Hook Form, Zod, React Router, Phosphor Icons.

## Estrutura do repositório

```
rocketseat-brev-ly/
├── server/   # API Fastify + Postgres + R2
└── web/      # SPA React + Vite
```

Cada pasta é um projeto pnpm independente, com o próprio `package.json` e o próprio `pnpm-lock.yaml`. Não existe workspace na raiz: a instalação é feita duas vezes, uma em cada pasta.

## Arquitetura do backend

O código é dividido em quatro camadas, com a ligação entre elas feita à mão em [server/src/container.ts](server/src/container.ts):

| Camada | Pasta | Responsabilidade |
| --- | --- | --- |
| Entidades | [server/src/entities/](server/src/entities/) | Regra de negócio e validação do link. Erros de domínio com código estável. |
| Serviços | [server/src/services/](server/src/services/) | Casos de uso e geração do CSV. |
| Repositórios | [server/src/repositories/](server/src/repositories/) | Acesso ao Postgres via Drizzle. |
| Storage | [server/src/storage/](server/src/storage/) | Interface `FileStorage`, implementada sobre o Cloudflare R2. |

Dois pontos que orientam o resto do código:

- **O identificador público da API é a `shortUrl`, nunca o `id`.** Ela é normalizada para minúsculo na escrita e na leitura, porque a constraint `UNIQUE` do Postgres em `text` diferencia maiúsculas.
- **Erros de domínio não carregam status HTTP.** Eles carregam um código (`INVALID_SHORT_URL`, `SHORT_URL_ALREADY_EXISTS`, `LINK_NOT_FOUND`); a tradução para HTTP acontece só na borda, em [server/src/error-handler.ts](server/src/error-handler.ts).

## API

Base: `http://localhost:3333`

| Método | Rota | Respostas |
| --- | --- | --- |
| `GET` | `/health` | `200` |
| `POST` | `/links` | `201` · `400 INVALID_SHORT_URL` · `409 SHORT_URL_ALREADY_EXISTS` |
| `GET` | `/links` | `200` |
| `GET` | `/links/:shortUrl` | `200` · `404 LINK_NOT_FOUND` |
| `PATCH` | `/links/:shortUrl/access-count` | `200` · `404 LINK_NOT_FOUND` |
| `DELETE` | `/links/:shortUrl` | `204` · `404 LINK_NOT_FOUND` |
| `POST` | `/exports/links` | `201 { fileName, url }` |

O `PATCH` de acesso devolve o link já atualizado. Por isso a página de redirecionamento faz uma requisição só: a mesma resposta que conta o acesso já traz a URL de destino.

### Fluxo do CSV

`POST /exports/links` gera o arquivo, sobe para o bucket R2 e responde com o endereço público. O conteúdo não trafega pela API no download — quem baixa é o navegador, direto da CDN.

O header `Content-Disposition: attachment` é gravado no objeto durante o upload. Sem ele o navegador abriria o CSV numa aba, porque o atributo `download` de um `<a>` é ignorado quando o arquivo vem de outra origem.

O nome é aleatório a cada chamada (`url-shotener-list-2026-08-28-17-44-03-e31538.csv`), então a rota é `POST` e não `GET`: cada chamada cria um arquivo novo.

## Pré-requisitos

- **Node.js 24 ou superior.** O servidor executa os arquivos `.ts` direto, sem passo de build, o que depende do type stripping nativo do Node 24.
- **pnpm** — `corepack enable` já resolve.
- **Docker** com Docker Compose, para o Postgres local.
- **Uma conta Cloudflare com um bucket R2.** Não é opcional: as cinco chaves `CLOUDFLARE_*` são validadas por Zod na subida do servidor ([server/src/env.ts](server/src/env.ts)) e, faltando qualquer uma, ele não inicia.

### O que pegar no Cloudflare

1. Crie um bucket no R2 e habilite o acesso público. Isso gera uma URL `https://pub-<hash>.r2.dev` — é o valor de `CLOUDFLARE_PUBLIC_URL`.
2. Gere um API token do R2 com permissão de leitura e escrita. Ele devolve o *Access Key ID* e o *Secret Access Key*.
3. O *Account ID* aparece no painel do R2. O endpoint autenticado é montado a partir dele pelo próprio código.

## Instalação

### 1. Clonar

```bash
git clone https://github.com/thiagofranco85/rocketseat-brev-ly.git
cd rocketseat-brev-ly
```

### 2. Subir o Postgres

```bash
cd server
docker compose up -d
```

Sobe um Postgres 18.3 na porta **5433** do host. Use este, não uma instalação local: o schema usa `uuidv7()` como default do `id`, função que só existe a partir do Postgres 18.

### 3. Configurar o `.env` do servidor

```bash
cp .env.example .env
```

Preencha:

```env
PORT=3333
DATABASE_URL=postgres://postgres:postgres@localhost:5433/brevly
CLOUDFLARE_ACCOUNT_ID=seu_account_id
CLOUDFLARE_ACCESS_KEY_ID=sua_access_key
CLOUDFLARE_SECRET_ACCESS_KEY=sua_secret_key
CLOUDFLARE_BUCKET=nome-do-bucket
CLOUDFLARE_PUBLIC_URL=https://pub-xxxxx.r2.dev
```

> **Escreva os valores sem aspas.** O `--env-file` do Docker não remove aspas, e elas entrariam dentro do valor — `CLOUDFLARE_PUBLIC_URL="https://..."` reprova na validação de URL do Zod. Sem aspas funciona nos dois caminhos, Node e Docker.

### 4. Instalar as dependências e aplicar a migration

```bash
pnpm install
pnpm db:migrate
```

O `db:migrate` lê o `.env` sozinho e cria a tabela `url_shortener`.

### 5. Subir a API

```bash
pnpm dev
```

Confira em `http://localhost:3333/health` — deve responder `{"status":"ok"}`.

### 6. Configurar e subir o frontend

Em outro terminal, a partir da raiz do repositório:

```bash
cd web
cp .env.example .env
pnpm install
pnpm dev
```

O `.env.example` do frontend já vem com `VITE_BACKEND_URL=http://localhost:3333`, que é o valor certo para o passo anterior. A aplicação abre em **`http://localhost:5300`**.

## Rodar o servidor em container (alternativa ao passo 5)

```bash
cd server
pnpm docker:build
pnpm docker:run
```

O `docker:run` reaproveita o mesmo `.env` e sobrescreve apenas o `DATABASE_URL` para `host.docker.internal:5433` na linha de comando — dentro do container, `localhost` seria o próprio container, não o host. **Não edite o `.env` para isso**; o valor `localhost` é o correto para o `pnpm dev` e continua sendo respeitado.

O Postgres é o mesmo em qualquer um dos dois modos: o do `docker-compose.yml`.

O `Dockerfile` é multi-stage e o processo roda com o usuário não-root `node`.

## Scripts

### `server/`

| Script | O que faz |
| --- | --- |
| `pnpm dev` | API em modo watch, na porta 3333. |
| `pnpm start` | API sem watch. |
| `pnpm typecheck` | `tsc --noEmit`. |
| `pnpm db:generate` | Gera uma migration a partir do schema Drizzle. |
| `pnpm db:migrate` | Aplica as migrations pendentes. |
| `pnpm docker:build` | Builda a imagem `brevly-server`. |
| `pnpm docker:run` | Roda o container na porta 3333. |

### `web/`

| Script | O que faz |
| --- | --- |
| `pnpm dev` | Vite na porta 5300. |
| `pnpm build` | Typecheck + build de produção. |
| `pnpm preview` | Serve o build na porta 4300. |
| `pnpm lint` | ESLint. |

As portas do frontend usam `strictPort`: se estiverem ocupadas, o Vite falha em vez de subir silenciosamente na porta seguinte.

## Variáveis de ambiente

### `server/.env`

| Chave | Obrigatória | Descrição |
| --- | --- | --- |
| `PORT` | Opcional | Porta da API. Ou dê um valor, ou apague a linha inteira: `PORT=` vazio **não** cai no default `3333`. A string vazia é convertida para `0`, e a API sobe numa porta aleatória sem avisar. |
| `DATABASE_URL` | Sim | Conexão com o Postgres. |
| `CLOUDFLARE_ACCOUNT_ID` | Sim | Monta o endpoint autenticado do R2. |
| `CLOUDFLARE_ACCESS_KEY_ID` | Sim | Credencial do API token do R2. |
| `CLOUDFLARE_SECRET_ACCESS_KEY` | Sim | Credencial do API token do R2. |
| `CLOUDFLARE_BUCKET` | Sim | Nome do bucket onde o CSV é gravado. |
| `CLOUDFLARE_PUBLIC_URL` | Sim | URL pública do bucket, de onde o navegador baixa o CSV. Não é o endpoint autenticado. |

### `web/.env`

| Chave | Obrigatória | Descrição |
| --- | --- | --- |
| `VITE_BACKEND_URL` | Sim | Endereço da API. |
| `VITE_FRONTEND_URL` | — | Sem uso. Não é lida pelo código; o host exibido nos links vem de `window.location`. |

## Portas usadas

| Serviço | Porta |
| --- | --- |
| API | 3333 |
| Frontend (dev) | 5300 |
| Frontend (preview) | 4300 |
| Postgres (host) | 5433 |

## Convenções

Commits seguem [Conventional Commits](https://www.conventionalcommits.org/). Código e mensagens de commit são escritos em inglês.
