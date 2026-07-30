# Abrand AI

A React + Vite web app that gives creators and brands an AI-powered "brand memory" — define your brand once, then generate consistently on-brand content every time.

## Stack

- **Frontend**: React 19, Vite 7, Tailwind CSS v4
- **Auth + Database**: Supabase
- **Payments**: Paystack (NGN subscriptions)
- **AI Backend**: External service at `https://abrandai.onrender.com`
- **Routing**: React Router DOM v7

## Running the app

```bash
npm run dev   # starts dev server on port 5000
npm run build # production build
```

The workflow "Start application" (`npm run dev`) is configured and runs on port 5000.

## Required environment variables

Set these in Replit's Secrets panel before the app will work:

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous/public key |
| `VITE_PAYSTACK_KEY` | Paystack public key |
| `VITE_PLAN_CODE_KEY` | Paystack subscription plan code |

## Project structure

```
src/
  pages/          # Public/auth pages (Landing, Login, Signup, etc.)
  Component/      # App pages (CreateContent, BrandSetup, ContentPage, Subscription)
  Footer/         # AboutSection page
  Service/        # authService.jsx — Supabase auth helpers
  contexts/       # AuthContext (auth state provider)
  supabaseClient.js
  App.jsx
  main.jsx
  index.css       # Tailwind + custom utility classes
```

## Supabase tables used

- `brandProfiles` — stores user brand setup (niche, tone, core_beliefs, banned_words)
- `subscriptions` — tracks user subscription status and plan
- `contents` — saved AI-generated content per user

## Design system

Dark-first design. Key CSS utilities (defined in `index.css`):
- `.card` — standard card surface
- `.input-field` — styled form inputs
- `.btn-primary` / `.btn-ghost` — button variants
- `.gradient-text` — indigo→violet gradient text
- `.glass` — frosted glass header/overlay

## User preferences

- Modern, clean dark UI with indigo/violet accent colors
- No `alert()` calls — all feedback via inline UI elements
- Consistent design language across all pages
