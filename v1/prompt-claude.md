# PROMPT PARA CLAUDE: Recriar site de convite de casamento em React/Vite

## REGRA DE ESTILO: PONETAIL (full)

Use a skill **ponytail** para guiar o estilo do código. Escreva código MÍNIMO e
DIRETO. Sem abstrações desnecessárias, sem factories, sem interfaces com 1
implementação. Stdlib > libs. Use o que o React já te dá. Poucos arquivos.
Código enxuto.

## O PROJETO ATUAL

Site de casamento (Epitacio & Bianca) feito em HTML/CSS/JS vanilla com Vite
como bundler. O backend PHP+MySQL foi planejado mas NÃO implementado — só
existe a infra Docker (nginx/php-fpm/mysql) com as configs prontas.

**Localização atual:** `~/projetos/convite` (será movido para `~/projetos/convite/v1`)
**Novo projeto:** `~/projetos/convite/v2`
**Casamento:** 21 de Outubro de 2026 às 16:30h
**Endereço:** Av. Benjamim Brasil, 570 - Maraponga, Fortaleza - CE, 60762-080

> **NOTA:** Antes de começar, mova todo o código atual para a pasta `v1/`
> (`~/projetos/convite/v1`). O novo projeto React será criado do zero em
> `~/projetos/convite/v2`. Os assets (imagens, ícones, favicon) devem ser
> copiados de `v1/public/` para `v2/public/`.

## O QUE DEVE SER PRESERVADO (100% igual)

1. **TODOS os assets** — copie `public/` integralmente:
   - `images/hero-bg.png` (fundo da hero)
   - `images/gallery/foto1-6.jpeg` (fotos do casal)
   - `icons/calendar.png, envelope.png, gift.png, hearts.png, pin.png`
   - `favicon.svg`

2. **Layout visual e paleta de cores** (CSS Design Tokens):
   ```
   --bg-primary: #FFFDF7     (Ivory - fundo)
   --bg-secondary: #F4E8D8   (Champagne - fundos alternados)
   --primary: #8FA8C8        (Dusty Blue - botões/destaques)
   --primary-dark: #6F8AA9   (hover)
   --primary-light: #EBF1F7  (bg de ícones)
   --accent: #C5A880         (Elegant Gold - linhas/subtítulos)
   --text-primary: #2E3033   (Graphite - texto)
   --text-secondary: #6B6D70 (Soft Grey)
   --border-color: #E2DDD5
   --font-serif: 'Playfair Display', Georgia, serif  (títulos)
   --font-sans: 'Inter', system-ui, sans-serif        (corpo)
   ```

3. **Todas as animações GSAP** — mesmo timing, easings, scroll triggers
4. **A mesma estrutura de seções** na mesma ordem vertical
5. **Comportamento responsivo** nos mesmos breakpoints (900px, 600px)

## ESTRUTURA DO LAYOUT (7 seções, nesta ordem)

### 1. Navbar (header fixo)
- Logo "E & B" à esquerda
- Links: Início, O Evento, Galeria, RSVP, Presentes
- Hamburguer menu no mobile (≤900px)
- Efeito scroll: fica transparente no topo, ganha bg ivory + blur + shadow ao rolar
- Scroll spy: destaca link da seção visível

### 2. Hero (fullscreen 100svh)
- Background parallax com `hero-bg.png` + overlay ivory translúcido
- Subtítulo "COM A BENÇÃO DE DEUS..." (gold, uppercase)
- Título "Epitacio & Bianca" (Playfair, itálico, clamp 3rem-4.5rem)
- Tagline "Convidam para celebrar..." (Playfair, itálico)
- Bloco de data: linhas douradas + "21 DE OUTUBRO DE 2026"
- Botão "Confirmar Presença" (pill, Dusty Blue, animação back.out)
- Scroll indicator (mouse animado com bouncing)
- Timeline GSAP no load: fade-in sequencial dos elementos + parallax scale no bg

### 3. Countdown
- Fundo champagne
- Grid de 4 cards: Dias | Horas | Minutos | Segundos
- Contagem regressiva para 21/Out/2026 16:30h
- Atualiza a cada 1s. Se data passou: "Chegou o Grande Dia!"

### 4. Detalhes do Evento
- Section header com ícone hearts.png (animação spin lenta)
- 2 cards lado a lado: "A Cerimônia" e "A Festa"
- Cada card: ícone, título, horário, venue em itálico gold, endereço
- Botões Google Maps e Waze abaixo de cada card
- Mesmo endereço nos dois (cerimônia e recepção no mesmo local)

### 5. Colagem Polaroid (galeria)
- Substitui a galeria original (que está comentada no HTML)
- Grid 2 colunas com efeito cascata (cards pares com margin-top maior)
- 6 fotos estilo polaroid: padding, box-shadow múltiplo, hover scale
- Animação GSAP com stagger 0.12s

### 6. RSVP (Confirmação de Presença)
- Card branco centralizado com ícone envelope
- **Modo público (sem convite):** campos nome, telefone, select de acompanhantes (1-4), textarea mensagem
- **Modo convite personalizado:** checkboxes com nomes dos membros da família, badge "já confirmado" nos já confirmados
- **Pós-confirmação:** mensagem de sucesso com GSAP fade+scale back.out
- O modo é determinado pela presença de `window.__INVITE` injetado pelo backend

### 7. Presentes & Pix
- Card branco com ícone gift.png
- Área Pix: chave + botão copiar (usa `navigator.clipboard`), feedback verde por 3s
- Lista dinâmica de presentes com nome, valor (R$), link, badge "Escolhido"
- Dados vêm de `window.__GIFTS`

### 8. Info (Dress Code & Dicas)
- 2 cards: "Traje: Esporte Fino" e "Dicas Importantes"
- Dress code: sugestões para elas e eles, dica de salto grosso
- Dicas: hospedagem, confirmação até 21/set, valet gratuito

### 9. Footer
- Fundo escuro, texto champagne, Playfair itálico
- "Com carinho, Epitacio & Bianca."
- "Feito especialmente para a família e amigos."

## ANIMAÇÕES GSAP (manter todas)

| Elemento | Trigger | Efeito | Duration | Ease |
|---|---|---|---|---|
| Hero BG | load | scale 1.05→1 | 2.5s | power2.out |
| Hero subtitle | timeline | fade + y30 | 1s | power3.out |
| Hero title | timeline | fade + y40 | 1.2s | power3.out |
| Hero tagline | timeline | fade + y30 | 1s | power3.out |
| Hero date | timeline | fade + scale 0.9→1 | 0.8s | power2.out |
| Hero CTA btn | timeline | fade + y20 | 0.8s | back.out(1.7) |
| Scroll indicator | timeline | fade in | 1s | - |
| Detalhes cards | scroll top 85% | fade + y50 | 1s | power3.out |
| Collage cards | scroll top 82% | fade + y60 + scale 0.88→1 | 0.75s | power3.out |
| Seções principais | scroll top 85% | fade + y30 | 1.2s | power2.out |
| RSVP success | JS trigger | fade + scale 0.9→1 | 0.6s | back.out(1.7) |

## TECNOLOGIAS

- **React 19** + **Vite 8** (já está no projeto como devDependency)
- **react-router-dom v7** para rotas (site público + painel admin)
- **GSAP** + ScrollTrigger para animações
- **Tailwind CSS** ou CSS puro (sem CSS-in-JS)
- Backend: **Node.js/Express** (substituindo o PHP planejado)
- Banco: **MySQL 8.0** (já configurado no docker-compose.yml)
- Conexão MySQL: use `mysql2` (driver promise-based)

## BANCO DE DADOS

O docker-compose.yml já tem MySQL configurado com:
- database: `convite`
- user: `convite`
- password: `convite_secret`

### Tabelas (criar migration/seed automática):

```sql
CREATE TABLE invites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(32) UNIQUE NOT NULL,
    family_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invite_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    confirmed BOOLEAN DEFAULT FALSE,
    confirmed_at TIMESTAMP NULL,
    FOREIGN KEY (invite_id) REFERENCES invites(id)
);

CREATE TABLE gifts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    link VARCHAR(500),
    chosen_by VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## BACKEND (Express API)

Substitui o PHP. Rotas:

### Site público
```
GET  /api/invite/:code        → retorna dados do convite + membros
POST /api/invite/:code/rsvp   → confirma presença (body: { member_ids: [] })
GET  /api/gifts               → lista de presentes
```

### Painel Admin (protegido por JWT)
```
POST /api/admin/login                    → login (retorna JWT)
GET  /api/admin/invites                  → lista todos os convites
POST /api/admin/invites                  → criar convite (family_name → gera code)
PUT  /api/admin/invites/:id              → editar convite
DELETE /api/admin/invites/:id            → deletar convite
POST /api/admin/invites/:id/members      → adicionar membro
DELETE /api/admin/members/:id            → remover membro
GET  /api/admin/gifts                    → lista presentes
POST /api/admin/gifts                    → adicionar presente
PUT  /api/admin/gifts/:id                → editar presente
DELETE /api/admin/gifts/:id              → deletar presente
GET  /api/admin/stats                    → estatísticas (total confirmados, pendentes, etc.)
```

## PAINEL ADMIN (React)

Rotas protegidas (`/admin/*`). Layout simples com sidebar:
- **Login** (`/admin/login`): formulário username + senha
- **Dashboard** (`/admin`): cards com stats (total convites, confirmados, pendentes)
- **Convites** (`/admin/invites`): CRUD tabela com search, botão copiar link do convite
- **Presentes** (`/admin/gifts`): CRUD tabela
- **Logout** no header

## ESTRUTURA DE ARQUIVOS

```
src/
├── main.jsx
├── App.jsx                         # Rotas (site público + admin)
├── styles/
│   └── global.css                  # Todo CSS do site (aprox. 1 arquivo, seções bem comentadas)
├── components/
│   ├── public/
│   │   ├── Navbar.jsx
│   │   ├── HeroSection.jsx
│   │   ├── CountdownSection.jsx
│   │   ├── EventDetailsSection.jsx
│   │   ├── CollageSection.jsx
│   │   ├── RSVPSection.jsx
│   │   ├── GiftsSection.jsx
│   │   ├── InfoSection.jsx
│   │   └── Footer.jsx
│   └── admin/
│       ├── AdminLayout.jsx         # Sidebar + header + outlet
│       ├── LoginPage.jsx
│       ├── DashboardPage.jsx
│       ├── InvitesPage.jsx
│       └── GiftsPage.jsx
├── hooks/
│   ├── useCountdown.js
│   └── useScrollSpy.js
├── api.js                          # fetch wrapper com JWT (unsado tanto no site como admin)
└── lib/
    └── db.js                       # Pool mysql2 (só no backend)
server/
├── index.js                        # Express server
├── db.js                           # MySQL connection pool
├── seed.js                         # Cria tabelas + admin padrão
├── routes/
│   ├── public.js                   # GET /api/invite/:code, POST /:code/rsvp, GET /api/gifts
│   └── admin.js                    # Todas as rotas admin com JWT middleware
└── middleware/
    └── auth.js                     # JWT verify middleware
```

## REQUISITOS IMPORTANTES

1. Ao acessar `?code=ABC123`, o backend injeta `window.__INVITE` no HTML
2. O RSVP se adapta automaticamente (modo público vs convite personalizado)
3. JWT no admin expira em 24h, refresh não necessário (simples)
4. Senha do admin padrão: hash bcrypt de "admin123" no seed
5. CSP mínimo para permitir Google Fonts e inline scripts do GSAP
6. Todas as imagens mantêm os mesmos paths (`/images/...`, `/icons/...`)
7. O CSS deve ser 1:1 com o original em termos visuais
8. Sempre use `.env` para secrets (JWT_SECRET, DB_PASS, PIX_KEY, etc.)
9. O `vite.config.js` já existe com `base: './'` e `emptyOutDir: false`

## O QUE NÃO FAZER

- NÃO mude o design, cores, fontes ou layout
- NÃO adicione bibliotecas desnecessárias (use o que o React/stdlib já dá)
- NÃO crie abstrações prematuras (1 componente por seção, sem sub-componentes)
- NÃO use Styled Components, CSS Modules — use Tailwind ou CSS puro
- NÃO crie tipos TypeScript (o projeto é JSX puro)
- NÃO mexa no docker-compose.yml (a infra já funciona)
- NÃO crie README nem documentação

## VERIFICAÇÃO

Ao final, o projeto deve:
1. Rodar com `npm run dev` (site público em :5173)
2. Rodar com `docker compose up` (site + API em :8080)
3. `npm run build` gerar o dist/ sem erros
4. O admin em `/admin` funcionar com login JWT
5. O RSVP personalizado funcionar com `?code=XXXX`
6. Todas as animações GSAP funcionarem idênticas ao original
