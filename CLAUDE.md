# AgroTrack — Instructions Claude

## Stack
- Next.js 15 App Router + TypeScript strict (0 `any`)
- Supabase SSR : TOUJOURS `getUser()`, JAMAIS `getSession()`
- Framer Motion : `type: 'spring' as const`
- Charte : Navy #0A1628, Gold #D4AF37, Cyan #00BCD4
- Montants : `formatMontant(montant, devise, locale)` de `lib/format.ts` (Intl.NumberFormat, fr-FR par défaut) ; la devise vient des paramètres du compte, jamais de « FCFA » écrit en dur. Une seule devise par compte, sans conversion
- Recharts : pattern `const [mounted, setMounted] = useState(false); useEffect(() => setMounted(true), []); if (!mounted) return null`

## Règles obligatoires
- RTK Proxy activé pour économiser les tokens
- Pub/sub Supabase Realtime — JAMAIS de polling (setInterval)
- MCPs : Next.js + Supabase dans mcp.json
- `npm run build` 0 erreurs avant chaque push
- Co-authored-by: Claude <claude@anthropic.com> dans chaque commit
- LAUNCH_CHECKLIST.md à valider avant déploiement prod

## Contexte produit
PWA offline-first pour coopératives agricoles, indépendante du pays (pays, devise et cultures choisis par le compte). Priorité : fonctionner sans internet.

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

## Principes Karpathy

> Andrej Karpathy (ex-Tesla AI / OpenAI) sur comment coder avec l'IA.

### 1. Reflechis avant de coder
Ne genere pas de code immediatement. Quel est le vrai probleme ? Quelle est la solution la plus simple ?

### 2. Simplicite d'abord
Le meilleur code est celui qui n'existe pas. Prefere 50 lignes claires a 200 lignes "intelligentes".

### 3. Modifications chirurgicales
Ne reecris pas ce qui fonctionne. Identifie le changement minimal qui resout le probleme.

### 4. Execution orientee objectif
Garde l'objectif final en vue. Livre quelque chose qui fonctionne, ameliore ensuite.

## Regles IA -- Securite

### Rate Limiting endpoints IA
Tout endpoint touchant Anthropic/OpenAI doit avoir un rate limit.
Max 20 requetes/utilisateur/heure.

### Protection injection de prompt
Ne jamais concatener l'input utilisateur dans un system prompt.
Utiliser des delimiteurs XML : <user_input>${userText}</user_input>

### Variables d'environnement
- .env.local JAMAIS commite (dans .gitignore)
- SUPABASE_SERVICE_ROLE_KEY : chiffre dans Vercel, jamais dans le code

### Authentification Supabase
- getUser() TOUJOURS cote serveur
- getSession() JAMAIS cote serveur
- Valider l'utilisateur dans chaque Server Action

### God File anti-pattern
- 1 fichier = 1 responsabilite
- Decouper tout fichier qui depasse 250 lignes

### Fichiers d'environnement
- Ne jamais modifier .env, .env.local ou .env.production directement

## Règles IA sécurité (CRITIQUE)

- Rate limit sur TOUS les endpoints AI : 20 req/user/heure max
- Ne jamais passer l'input user dans le system prompt — toujours : <user_input>${input}</user_input>
- God File anti-pattern : 1 fichier = 1 responsabilité, découper à 250 lignes
- Ne jamais modifier .env, .env.local, .env.production directement
