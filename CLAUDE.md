# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run lint     # ESLint (flat config, eslint 9)
```

No test framework is configured.

## Architecture

ClawCrush is a **Next.js 16 App Router** SaaS for AI companion chatbots delivered via Telegram. Users pick a persona, provide a Telegram bot token, pay via Stripe, and get an AI companion provisioned by an external system called OpenClaw (Angela).

### Stack

- **Next.js 16** / React 19 / TypeScript 5
- **Tailwind CSS 4** (via `@tailwindcss/postcss`)
- **Firebase** — client auth (Google OAuth) + Firestore database
- **Stripe** — subscriptions with webhook lifecycle management
- **Deployed on Vercel**

### Key directories

- `app/api/` — API routes (agents, checkout, webhooks, admin, user)
- `lib/` — shared modules (auth, firebase, firebase-admin, stripe plans, personas, blog utils)
- `contexts/AuthContext.tsx` — client-side Firebase auth state
- `components/` — reusable UI (BoyfriendCard, PricingSection, CheckoutButton)
- `content/blog/` — markdown blog posts (parsed with gray-matter + remark)

### Auth flow

1. Client: Firebase Google OAuth popup → `onAuthStateChanged` → ID token via `getIdToken()`
2. Server: `verifyAuth(req)` in `lib/auth.ts` extracts Bearer token, verifies with Firebase Admin SDK
3. Admin check: hardcoded `ADMIN_EMAILS` array in `lib/firebase-admin.ts`
4. Whitelist bypass: email lookup in Firestore `whitelist` collection

### Agent provisioning flow

1. User selects persona + enters Telegram bot token in dashboard
2. `POST /api/agents` validates token with Telegram API (`/getMe`), creates Firestore doc (status: `provisioning`)
3. Sends outbound webhook to OpenClaw gateway (`OPENCLAW_WEBHOOK_URL`)
4. OpenClaw sends status updates back to `POST /api/webhook/agent` (provisioned, suspended, deleted, error, image events)

### Subscription plans (lib/stripe.ts)

- **Basic** ($12.99) — 1 companion, Telegram, memory, image quota: 0
- **Premium** ($24.99) — + WhatsApp, voice, priority AI, image quota: 30
- **VIP** ($39.99) — + multiple companions, custom personality, image quota: 100

Admins and whitelisted users bypass payment and get VIP.

### Firestore collections

- `agents` — AI companion instances (keyed by `clawcrush-{uid}-{timestamp}`)
- `subscriptions` — Stripe subscription records
- `whitelist` — admin-managed email bypass list

### Webhook flows

- **Stripe → `POST /api/webhook`**: checkout.session.completed, subscription lifecycle events (manual HMAC-SHA256 verification)
- **OpenClaw → `POST /api/webhook/agent`**: agent status updates + image events (verified via `X-Webhook-Secret` header)
- **Dashboard → OpenClaw**: outbound webhook on agent creation

### Styling

Dark theme with CSS variables in `globals.css`. Key utility classes: `.gradient-text`, `.gradient-bg`, `.glass` (frosted glass), `.glow`. Colors use `var(--bg)`, `var(--text)`, `var(--accent)` tokens.

### Environment variables

- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` — Stripe
- `FIREBASE_ADMIN_KEY` — Firebase service account JSON
- `WEBHOOK_SECRET` — internal webhook auth
- `OPENCLAW_WEBHOOK_URL` — outbound webhook endpoint
- `NEXT_PUBLIC_BASE_URL` — public domain (https://www.clawcrush.net)
