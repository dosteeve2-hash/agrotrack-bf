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

---

## Karpathy Guidelines — Comportement Claude Code

Dérivé des observations d'Andrej Karpathy sur les pièges des agents de coding IA.

**Biais : prudence plutôt que vitesse. Pour les tâches triviales, utilise le jugement.**

### 1. Réfléchis avant de coder

**Ne suppose pas. Ne cache pas ta confusion. Expose les compromis.**

Avant d'implémenter :
- Énonce tes hypothèses explicitement. En cas de doute, pose la question.
- Si plusieurs interprétations existent, présente-les — ne choisis pas silencieusement.
- Si une approche plus simple existe, dis-le. Pousse en arrière si nécessaire.
- Si quelque chose n'est pas clair, arrête-toi. Nomme ce qui est confus. Pose la question.

### 2. Simplicité d'abord

**Code minimal qui résout le problème. Rien de spéculatif.**

- Pas de fonctionnalités au-delà de ce qui a été demandé.
- Pas d'abstractions pour du code à usage unique.
- Pas de "flexibilité" ou "configurabilité" non demandées.
- Pas de gestion d'erreurs pour des scénarios impossibles.
- Si tu écris 200 lignes et que 50 suffiraient, réécris-le.

Demande-toi : "Un ingénieur senior dirait-il que c'est trop compliqué ?" Si oui, simplifie.

### 3. Modifications chirurgicales

**Touche seulement ce qui est nécessaire. Nettoie uniquement ton propre désordre.**

En éditant du code existant :
- Ne "améliore" pas le code adjacent, les commentaires, ou le formatage.
- Ne refactorise pas ce qui n'est pas cassé.
- Correspond au style existant, même si tu ferais autrement.
- Si tu remarques du code mort non lié, mentionne-le — ne le supprime pas.

Quand tes changements créent des orphelins :
- Supprime les imports/variables/fonctions que TES changements ont rendus inutilisés.
- Ne supprime pas le code mort préexistant sauf si demandé.

Le test : chaque ligne modifiée doit tracer directement à la demande de l'utilisateur.

### 4. Exécution orientée objectif

**Définis des critères de succès. Boucle jusqu'à vérification.**

Transforme les tâches en objectifs vérifiables :
- "Ajouter une validation" → "Écrire des tests pour les entrées invalides, puis les faire passer"
- "Corriger le bug" → "Écrire un test qui le reproduit, puis le faire passer"
- "Refactoriser X" → "S'assurer que les tests passent avant et après"

Pour les tâches multi-étapes, énonce un plan bref :
```
1. [Étape] → vérifier : [check]
2. [Étape] → vérifier : [check]
3. [Étape] → vérifier : [check]
```

**Ces guidelines fonctionnent si :** moins de changements inutiles dans les diffs, moins de réécritures dues à la surcomplication, et les questions de clarification viennent avant l'implémentation plutôt qu'après les erreurs.
