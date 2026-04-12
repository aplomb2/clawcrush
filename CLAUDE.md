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

Path alias: `@/*` maps to project root (configured in `tsconfig.json`).

### Key directories

- `app/api/` — API routes (agents, checkout, webhooks, admin, user, billing-portal, subscription)
- `lib/` — shared modules (auth, firebase, firebase-admin, stripe plans, personas, blog utils, types)
- `contexts/AuthContext.tsx` — client-side Firebase auth state + `useAuth()` hook
- `components/` — reusable UI (BoyfriendCard, PricingSection, CheckoutButton, TrackClick, MobileNav)
- `content/blog/` — markdown blog posts (parsed with gray-matter + remark)

### Auth flow

There is **no middleware.ts** — auth is handled per-route via `verifyAuth()`.

1. Client: Firebase Google OAuth popup → `onAuthStateChanged` → ID token via `getIdToken()`
2. Server: `verifyAuth(req)` in `lib/auth.ts` extracts `Authorization: Bearer {idToken}`, verifies with Firebase Admin SDK
3. Admin check: hardcoded `ADMIN_EMAILS` array in `lib/firebase-admin.ts`
4. Whitelist bypass: email lookup in Firestore `whitelist` collection

Admins and whitelisted users bypass payment and get VIP-level access.

### Agent provisioning (two-step flow)

1. User selects persona + plan → Stripe checkout → `POST /api/webhook` receives `checkout.session.completed`
2. Success page (`/payment/success`) shows "Awakening" animation, polls `GET /api/agents/status?session_id=` for real-time updates
3. Dashboard modal prompts user to enter Telegram bot token → `POST /api/agents/bot-token` validates with Telegram API (`/getMe`)
4. `POST /api/agents` creates Firestore doc (status: `provisioning`), sends outbound webhook to OpenClaw
5. OpenClaw sends status updates back to `POST /api/webhook/agent` (provisioned → active with telegramBotLink)

### Subscription plans (lib/stripe.ts)

- **Basic** ($12.99) — 1 companion, Telegram, memory, image quota: 0
- **Premium** ($24.99) — + WhatsApp, voice, priority AI, image quota: 30
- **VIP** ($39.99) — + multiple companions, custom personality, image quota: 100

### Firestore collections

- `agents` — AI companion instances (keyed by `clawcrush-{uid}-{timestamp}`)
- `subscriptions` — Stripe subscription records
- `whitelist` — admin-managed email bypass list

### Webhook security

- **Stripe → `POST /api/webhook`**: Manual HMAC-SHA256 verification with timestamp (raw `fetch()` used instead of Stripe SDK for Vercel compatibility)
- **OpenClaw → `POST /api/webhook/agent`**: Verified via `X-Webhook-Secret` header match
- **Dashboard → OpenClaw**: Outbound webhook on agent creation

### Stripe integration note

Checkout sessions use raw `fetch()` against the Stripe API (not the Node SDK) to avoid connection issues on Vercel. Webhook verification is also manual HMAC-SHA256 with `crypto.timingSafeEqual`.

### GA4 & ad attribution

- GA4 tracking script embedded in `app/layout.tsx`
- `TrackClick` component fires GA4 events for CTA clicks
- gclid + UTM params (source, campaign, term) captured from URL → `localStorage` → passed as Stripe checkout metadata

### Personas (lib/personas.ts)

10 personas total (5 female, 5 male), each with: name, Chinese name, gender, age, emoji, color gradient, avatar, description, trait tags, and a 3-message preview conversation.

### Styling

Dark theme with CSS variables in `globals.css`. Key utility classes: `.gradient-text`, `.gradient-bg`, `.glass` (frosted glass), `.glow`. Colors use `var(--bg)`, `var(--text)`, `var(--accent)` tokens.

### SEO

`app/robots.ts` and `app/sitemap.ts` generate dynamic SEO files. Homepage includes JSON-LD structured data.

### Environment variables

- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` — Stripe
- `FIREBASE_ADMIN_KEY` — Firebase service account JSON
- `WEBHOOK_SECRET` — internal webhook auth
- `OPENCLAW_WEBHOOK_URL` — outbound webhook endpoint
- `NEXT_PUBLIC_BASE_URL` — public domain (https://www.clawcrush.net)
