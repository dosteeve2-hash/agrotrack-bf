# AgroTrack BF — Instructions Claude

## Stack
- Next.js 15 App Router + TypeScript strict (0 `any`)
- Supabase SSR : TOUJOURS `getUser()`, JAMAIS `getSession()`
- Framer Motion : `type: 'spring' as const`
- Charte : Navy #0A1628, Gold #D4AF37, Cyan #00BCD4
- Montants FCFA : `new Intl.NumberFormat('fr-FR').format(n) + ' FCFA'`
- Recharts : pattern `const [mounted, setMounted] = useState(false); useEffect(() => setMounted(true), []); if (!mounted) return null`

## Règles obligatoires
- RTK Proxy activé pour économiser les tokens
- Pub/sub Supabase Realtime — JAMAIS de polling (setInterval)
- MCPs : Next.js + Supabase dans mcp.json
- `npm run build` 0 erreurs avant chaque push
- Co-authored-by: Claude <claude@anthropic.com> dans chaque commit
- LAUNCH_CHECKLIST.md à valider avant déploiement prod

## Contexte produit
PWA offline-first pour coopératives agricoles BF. Priorité : fonctionner sans internet.
