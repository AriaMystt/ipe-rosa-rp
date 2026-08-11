# Ipê Rosa RP

Site oficial de whitelist e gestão de personagens para a comunidade de roleplay **Ipê Rosa**, no Roblox. Integra autenticação social via Discord, envio e aprovação de fichas de personagem, e automações que refletem o resultado da avaliação diretamente no servidor do Discord (DM + atribuição de cargo).

## Funcionalidades

- **Login com Discord (OAuth2)** — autenticação via conta do Discord, sem necessidade de senha própria
- **Envio de ficha de personagem** — formulário onde o jogador preenche nome, idade, etnia, ano, conexões, lore e personalidade do personagem
- **Painel administrativo** — área restrita para staff revisar, aprovar ou recusar fichas
- **Automação com Discord** — ao aprovar/recusar uma ficha:
  - o sistema envia uma DM ao jogador com o resultado
  - o cargo de whitelist é atribuído ou removido automaticamente no servidor
  - um webhook notifica o canal de staff sobre a movimentação
- **Perfil do usuário** — visualização da própria ficha e status (pendente, aprovada, recusada)
- **Página de lore** — conteúdo narrativo da comunidade

## Tecnologias

**Front-end**
- React 19 + TypeScript
- Vite
- React Router
- React Hook Form
- Tailwind CSS

**Back-end**
- Node.js + Express 5
- SQLite (`better-sqlite3`)
- Autenticação via JWT (cookie `httpOnly`)
- Integração com a API do Discord (OAuth2, Bot API, Webhooks)

## Como funciona a autenticação

1. O usuário clica em "Entrar com Discord" e é redirecionado para o fluxo OAuth2 do Discord
2. Após autorizar, o Discord redireciona de volta com um `code`, que o back-end troca por um `access_token`
3. Os dados do usuário são buscados na API do Discord e um token de sessão (JWT) é gerado
4. O token é salvo em um cookie `httpOnly`, usado para autenticar as próximas requisições

Rotas administrativas exigem que o ID do Discord do usuário esteja na lista de administradores (`ADMIN_DISCORD_IDS`), verificada em cada requisição por um middleware dedicado.

## Rodando localmente

### Pré-requisitos
- Node.js 18+
- Uma aplicação registrada no [Discord Developer Portal](https://discord.com/developers/applications) (para obter Client ID, Client Secret e Bot Token)

### Instalação

```bash
git clone <url-do-repositorio>
cd ipe-rosa-rp
npm install
```

### Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com base no exemplo abaixo:

```env
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
DISCORD_BOT_TOKEN=
DISCORD_REDIRECT_URI=http://localhost:8080/auth/discord/callback
DISCORD_WEBHOOK_FICHAS_URL=
DISCORD_GUILD_ID=
DISCORD_WHITELIST_ROLE_ID=
ADMIN_DISCORD_IDS=
JWT_SECRET=
NODE_ENV=development
PORT=8080
```

> Nunca faça commit do seu `.env` real — mantenha apenas um `.env.example` versionado.

### Scripts disponíveis

```bash
npm run dev       # inicia o front-end em modo desenvolvimento (Vite)
npm run build     # compila o front-end para produção
npm run start     # inicia o servidor Express (serve API + front-end buildado)
npm run lint      # roda o linter (oxlint)
```

Para desenvolvimento completo, rode o back-end (`npm run start`) e o front-end (`npm run dev`) em terminais separados — o Vite já está configurado para fazer proxy de `/auth` e `/api` para `http://localhost:8080`.

## Estrutura do projeto

```
src/
├── pages/
│   ├── home.tsx           # página inicial
│   ├── entrar.tsx         # login
│   ├── ficha.tsx          # formulário de ficha de personagem
│   ├── perfil.tsx         # perfil e status da ficha do usuário
│   ├── lore.tsx           # lore da comunidade
│   └── admin/
│       ├── admin.tsx      # dashboard administrativo
│       └── fichas.tsx     # revisão e aprovação de fichas
├── components/            # header, footer
├── hooks/
│   └── useAuth.ts         # hook de autenticação
index.js                   # servidor Express (API + auth + integração Discord)
database.js                # configuração do SQLite
```

## Licença

Projeto de uso interno da comunidade Ipê Rosa RP.