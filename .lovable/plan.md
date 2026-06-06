## Objetivo
Replicar fielmente a versão **pública** da sua AXO OS (`75ef3430-...`) neste projeto. Resultado: cada página pública abre idêntica em layout, conteúdo, fontes, cores e comportamento.

## Estratégia
O template atual usa TanStack Start + Tailwind v4. A AXO OS usa Vite + React Router + Tailwind v3. Para garantir 1:1 visual e comportamental:

1. **Manter o shell TanStack Start** (exigência do template), mas montar dentro dele uma rota catch-all SSR-off que renderiza o `App.tsx` original com `react-router-dom`. Assim todo o código de páginas/componentes roda exatamente como no original.
2. **Substituir `styles.css`** pelo `index.css` original (traduzido pro formato Tailwind v4 com `@theme`, mantendo todos os tokens HSL, gradientes, sombras, utilitários mobile e classes `.hero-gradient`, `.text-gradient-gold` etc.).
3. **Instalar dependências faltantes**: `react-router-dom`, `framer-motion`, `dompurify`, `jspdf`, `qrcode`, `leaflet`, `react-leaflet`, `heic2any`, `@remotion/media-parser`, `@remotion/webcodecs`, `@dnd-kit/*`, `@tanstack/react-table`, `react-signature-canvas`, `next-themes`, `@radix-ui/react-{toast,drawer,...}` faltantes, `embla-carousel-react` extras, `@types/*`.
4. **Copiar bulk dos diretórios** da AXO OS:
   - `src/components/{shared,ui,quiz,referral}/*`
   - `src/contexts/*`, `src/data/*`, `src/types/*`
   - `src/integrations/supabase/*` (sobrescrevendo o stub atual)
   - `src/lib/*`, `src/utils/*`
   - `src/hooks/*` (todos os que páginas públicas importam direta ou transitivamente — começo com os de Lead/Referral/Portal/Beforeafter e amplio conforme imports)
   - `src/assets/*` (todos os JPG/PNG/GIF/WebP, incluindo `before-after/` e `stains/red-oak/`)
   - `public/*` (favicons, logos, gifs, manifest, `axo-master-system.html`, `icons/`, `robots.txt`, `sitemap.xml`)
5. **Copiar páginas públicas**: Index, Installation, Refinishing, HardwoodFlooring, SandingRefinish, VinylPlankFlooring, Staircase, BaseBoards, Gallery, StainGallery, Contact, About, Campaign, Quiz, FloorDiagnostic, ThankYou, ScheduleEstimate, ReferralProgram, ReferralAuth, ResetPassword, Builders, Realtors, BuilderPartnerships, PartnerProgram, AxoMasterSystem, WowPack, ReviewRequest, Auth, NotFound, Links, SharedPost, ShareBeforeAfter, PublicInvoice, PublicProposal, PublicDepositInvoice, PublicPortal.
6. **Recriar `App.tsx`** sem as rotas de `/admin`, `/collaborator`, `/partner` (e sem `ProtectedRoute`), exatamente como no original em todo o resto.
7. **Substituir `index.html`** local com o `<head>` original (SEO, schema LocalBusiness, Meta Pixel, OG tags) — adaptado ao bootstrap TanStack.
8. **Verificação**: abrir `/`, `/installation`, `/refinishing`, `/quiz`, `/gallery`, `/stain-gallery`, `/about`, `/contact`, `/builders`, `/realtors`, `/campaign`, `/wow-pack`, `/hub` e comparar com a AXO OS de produção (`https://axofloorsnj.lovable.app`). Corrigir qualquer asset/hook faltante.

## O que NÃO vai entrar
Páginas e rotas de `/admin/*`, `/collaborator/*`, `/partner/*` (e seus componentes/hooks exclusivos). Foi sua escolha "só páginas públicas".

## Risco / observação
- Pode haver imports transitivos de hooks "admin" dentro de componentes públicos (raro mas possível). Vou resolver caso a caso copiando o hook/utilitário necessário sem trazer páginas admin.
- O número total de arquivos copiados deve ficar entre 200 e 300. Vou em lotes paralelos pra ir rápido.
- Será um único turno longo, mas no fim você abre o preview e vê o site clonado.
