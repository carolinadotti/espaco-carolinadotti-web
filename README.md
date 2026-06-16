# Espaço Carolina Dotti

Site institucional do Espaço Carolina Dotti com painel administrativo.

## Stack

- **Next.js 16.2.7** (App Router, Turbopack)
- **TypeScript** + **Tailwind CSS v4**
- **shadcn/ui** + **lucide-react**
- **Prisma 7** + **PostgreSQL (NeonDB)**
- **Auth.js v5** (NextAuth) com Credentials Provider
- **Cloudflare Turnstile** (captcha no login)
- **Vercel Blob** (armazenamento de imagens em produção)
- **sharp** (otimização de imagens no servidor)
- **react-easy-crop** (recorte de imagens no admin)
- **Recharts** (gráficos no dashboard)

## Configuração Inicial

### 1. Variáveis de Ambiente

Copie `.env.local` e preencha com seus valores reais:

```bash
cp .env.local .env.local
```

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | String de conexão NeonDB (ex: `postgresql://...@ep-xxx.neon.tech/...?sslmode=verify-full`) |
| `DIRECT_URL` | Mesma URL sem pooling (para migrações) |
| `AUTH_SECRET` | Gere com: `openssl rand -base64 32` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Site Key do Cloudflare Turnstile |
| `TURNSTILE_SECRET_KEY` | Secret Key do Cloudflare Turnstile |
| `BLOB_READ_WRITE_TOKEN` | Token do Vercel Blob (opcional em dev) |

> **Chaves de teste Turnstile (dev):** Site Key `1x00000000000000000000AA` / Secret `1x0000000000000000000000000000000AA` — sempre passam a validação.

### 2. Banco de Dados (NeonDB)

```bash
# Criar e aplicar schema
npm run db:push

# Popular com usuários e settings padrão
npm run db:seed
```

**Usuários criados pelo seed:**
- `fagnernlopes@gmail.com`
- `carolinadotti@outlook.com`
- **Senha inicial:** `CarolinaDotti@2026!`

### 3. Desenvolvimento

```bash
npm run dev
```

O site estará disponível em `http://localhost:3000`.

## URLs

| Rota | Descrição |
|---|---|
| `/` | Landing page pública |
| `/login` | Login admin |
| `/dashboard` | Painel com métricas e gráficos |
| `/dashboard/hero` | Edição da seção Hero (título, subtítulo e imagens desktop/mobile) |
| `/dashboard/about` | Edição da seção Sobre (título, texto e imagem) |
| `/dashboard/gallery` | Edição da seção Espaço (galeria de fotos: título, descrição e fotos) |
| `/dashboard/settings` | Configurações (contato + SEO) |

## Imagens

Coloque imagens de fallback em `/public/images/`:

```
public/
  images/
    hero-fallback.jpg        # 1920x1080
    about-fallback.jpg       # 800x1067
    service-mechas.jpg       # qualquer tamanho, será exibido 4:5
    service-penteados.jpg
    service-maquiagem.jpg
    service-coloracao.jpg
    service-corte.jpg
    service-tratamentos.jpg
    service-escova.jpg
```

Em desenvolvimento, imagens enviadas pelo admin são salvas em `/public/uploads/`.

## Deploy (Vercel)

1. Conecte o repositório no Vercel
2. Configure as variáveis de ambiente no painel Vercel
3. Ative o Vercel Blob Storage e copie o token para `BLOB_READ_WRITE_TOKEN`
4. Execute o seed no console Neon ou via `npm run db:seed` localmente

## Segurança

- **Rate limit:** 5 tentativas de login por IP a cada 15 minutos (em memória)
- **Turnstile:** Cloudflare verificado no servidor antes do Auth.js
- **Senhas:** bcrypt com salt rounds 12
- **Sessão:** JWT (Auth.js v5)
- **Rotas protegidas:** `/dashboard/*` requer sessão ativa (verificado no proxy/middleware)

## Próximas Funcionalidades (Sprint 2)

- Cadastro de produtos e estoque
- Ordens de serviço
- Controle de receitas e despesas
