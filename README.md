# MyPsy PWA

MyPsy est une application web progressive (Next.js + TypeScript) pensée pour offrir un soutien psycho-émotionnel écrit, non médical. L’app tourne sur les API Routes Vercel, applique un middleware de quotas et stocke localement le questionnaire utilisateur pour contextualiser les réponses de « Camille ».

## Stack
- Next.js 14 (App Router, TypeScript)
- API Routes serverless (Vercel)
- OpenAI Responses API côté serveur uniquement
- Luxon pour la gestion du fuseau Europe/Paris

## Démarrage local
```bash
pnpm install
pnpm dev
```

> ⚠️ Les dépendances nécessitent Node 18+. Active `pnpm` via Corepack si besoin (`corepack enable`).

## Variables d’environnement
Copie `.env.example` vers `.env.local` puis complète :

```
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
JWT_SECRET=une_chaine_longue
TIMEZONE=Europe/Paris
OPEN_HOURS_START=10
OPEN_HOURS_END=22
```

Ne diffuse jamais la clé OpenAI côté client. Toutes les requêtes passent par `/api/chat`.

## Déploiement Vercel
1. Crée un projet Vercel relié au dépôt.
2. Ajoute les variables d’environnement ci-dessus dans l’onglet Settings > Environment Variables.
3. Configure les headers par défaut (Vercel gère automatiquement les cookies `Secure`).
4. Déploie (`pnpm build`).

## Tests manuels
1. Complète le questionnaire `/questionnaire` (données stockées en localStorage).
2. Consulte `/plans` (boutons « Bientôt » désactivés).
3. Lance `/chat` : un identifiant local est généré, le middleware `/api/chat` applique horaires (10h–22h, 6j/7) et quota (50 messages/jour).
4. Les pages `/legal/*` affichent les textes obligatoires, `/success` sert de page technique pour les futures magic links.

## Intégrations futures
- Ajouter les URLs de checkout (Essentiel / Plus / Premium) et les secrets webhook dans `/api/payment/webhook`.
- Brancher un KV / Redis en implémentant l’interface `QuotaStore` (voir `src/lib/quota.ts`).
- Alimenter `EntitlementStore` et `PaymentProviderAdapter` (placeholders prévus pour les prochains sprints).
