# Auditoria Google Growth — AXO Floors (Projeto B, somente leitura)

Nenhuma alteração feita. Evidências vêm do código atual e de requisições locais à prévia. Indexação real, rankings e dados de GSC/GA4/GBP NÃO foram verificados.

## 1. Como o Google recebe o HTML hoje (evidência)

- `src/routes/index.tsx` e `src/routes/$.tsx`: `ssr: false` + `<ClientOnly fallback={<div style="min-height:100vh"/>}>` envolvendo `src/App.tsx` (React Router `BrowserRouter`).
- Resposta local de `/`: ~4,8 KB de HTML, só head + div vazio. O conteúdo (títulos, texto, serviços) só aparece após JavaScript. Google consegue renderizar JS, mas com atraso, menos confiável e sem conteúdo para outros bots/IA.
- Head SSR do `$.tsx` é genérico para TODAS as páginas (`/installation`, `/refinishing`, `/stairs`, `/gallery`, `/about`, `/contact` recebem o mesmo título "AXO Floors NJ — Flooring Services & Projects"). O título real é trocado depois via `src/components/shared/SEOHead.tsx` no navegador.
- Já com SSR real (manter): `service-areas.new-jersey.index.tsx`, `service-areas.new-jersey.$slug.tsx`, `blog.index.tsx`, `blog.$slug.tsx`, `finishes.tsx`.

## 2. Metadados, dados estruturados e URLs

- `src/routes/__root.tsx` linha 59: `aggregateRating 4.9/47` autodeclarado — inelegível para rich results e não verificado contra o GBP. Também duplicado em `GoogleBusinessIntegration.tsx` (com `placeid=ChIJExample` falso). Remover ambos.
- `__root.tsx` define `og:image` = favicon e `og:title/description` no root (vaza para todas as páginas). Mover para folhas.
- Inconsistência factual: Index "over a decade" / "10-Year Warranty"; About "Over a decade" e "nearly a decade" (Eduardo); WowPack "10 years"; Installation "10-year warranty"; HardwoodFlooring "Lifetime Warranty". Precisa confirmação do dono (anos de operação, termos da garantia por escrito) antes de qualquer texto.
- Rota inexistente retorna HTTP **200** (soft 404) — confirmado localmente.
- `/hardwood-flooring` e `/sanding-and-refinish` redirecionam só no navegador (`<Navigate>`), sem 301. `public/robots.txt` ainda lista essas URLs antigas e `/staircase` (inexistente), e não lista `/installation`, `/refinishing`, `/stairs`. Sitemap (`src/routes/sitemap[.]xml.ts`) não inclui `/stairs` nem `/finishes`, mas inclui `/get-started`, `/schedule-estimate`, `/hub` (páginas de funil, baixa prioridade).
- `www.axofloorsnj.com`: domínio "initiated", não ativo (antes retornava 421). DNS na HostGator.

## 3. Conversão e GA4 (já funciona vs pendente)

Funciona: page_view único por navegação, caminhos sanitizados (cidades/blog agrupados), `generate_lead` após save confirmado no /get-started, `estimate_step_1_completed` só após `captured` do servidor, clique SMS com rótulo fixo.
Pendente: `phone_click` preparado mas não conectado; GA4 key events não confirmados no painel; ingestão real só verificável no Realtime.
Imagens/CWV: sem medição de campo (CrUX/PSI) feita; LCP provavelmente prejudicado pelo render só no cliente.

## 4. Verificações externas (dono faz, com evidência esperada)

- GSC: propriedade Domain verificada (TXT HostGator); Inspeção de URL em `/` e `/refinishing` mostrando "HTML renderizado" com conteúdo; sitemap enviado sem erros.
- GA4: `generate_lead` e `estimate_step_1_completed` marcados como key events; Realtime mostrando teste.
- GBP: proprietário verificado, categoria principal "Flooring contractor"/serviços de refinishing, NAP idêntico ao site, número real de avaliações (substitui qualquer valor inventado).
- Ads: só após conversões confirmadas.

## 5. Roadmap por severidade

P0 (bloqueia visibilidade)
1. Conteúdo das páginas principais não está no HTML do servidor + head genérico. Esforço: médio-alto, faseado.
2. aggregateRating autodeclarado e placeid falso. Esforço: baixo.
3. Soft 404 e redirecionamentos sem 301. Esforço: baixo-médio.

P1 (ganhos rápidos)
- robots.txt corrigido; sitemap com `/stairs`, `/finishes`, sem funil.
- Unificar fatos (anos, garantia) após confirmação.
- Ligar `phone_click`; confirmar key events.
- www ativo com redirect para o domínio principal.

P2
- Conteúdo humano focado em Sanding & Refinishing por cidades reais atendidas; fotos reais com alt descritivo; reviews GBP orgânicas; depois Ads.

## 6. Próximo passo seguro — Fase 2A (piloto de UMA página)

Página piloto recomendada: `/refinishing` (serviço prioritário, sem formulários sensíveis). Não tocar no `/get-started`.

- Criar `src/routes/refinishing.tsx` com SSR e `head()` próprio (title, description, canonical `https://axofloorsnj.com/refinishing`, og:*, JSON-LD `Service`), renderizando o conteúdo de `src/pages/Refinishing.tsx` sem React Router (links `<a>`, como `ssr/SafeLink.tsx`), Header/Footer SSR existentes.
- Remover `/refinishing` de `src/App.tsx`; demais páginas continuam no `$.tsx`.
- Servidor: 301 de `/sanding-and-refinish` → `/refinishing`.
- Testes: HTML do servidor contém o H1 e canonical; um único page_view em navegação; mobile 375/desktop 1280; nenhuma mudança no /get-started e eventos.
- Rollback: apagar a rota nova e restaurar a linha no `App.tsx`.
- Depois: Home (mais complexa, browser APIs), Installation, Stairs, Vinyl, Gallery, About, Contact — uma por vez.

## Incertezas

Indexação, posições e tráfego desconhecidos (não usar "site:" como prova). Status do GBP, GA4 key events e GSC desconhecidos. Fatos de anos/garantia aguardam o dono.
