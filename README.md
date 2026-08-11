# Ecom Frontend

A Next.js 16 storefront that consumes the [ecom-api](../ecom-api) Fastify backend. Built with the App Router, Tailwind CSS v4, and shadcn/ui (base-nova).

## Features

- **Authentication** — login, register, and token refresh against the Fastify API.
- **Product catalog** — browse and search products.
- **Cart** — add, update, and remove items (authenticated or guest via session id).
- **Checkout** — create orders and pay with Stripe Payment Element.
- **Orders** — view order history and details.
- **Admin dashboard** — placeholder stats overview (requires `stats:read` permission).

## Tech Stack

- Next.js 16 with App Router
- React 18
- Tailwind CSS v4
- shadcn/ui (base-nova)
- TypeScript

## Getting Started

1. Copy environment variables and fill in the real values:

   ```bash
   cp .env.example .env.local
   ```

2. Make sure the Fastify API is running on `http://localhost:3000` and its `FRONTEND_URL` is set to `http://localhost:3001`.

3. Install dependencies and run the dev server:

   ```bash
   npm install
   npm run dev
   ```

4. Open [http://localhost:3001](http://localhost:3001).

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the development server on port 3001 |
| `npm run build` | Create an optimized production build |
| `npm run start` | Start the production server |
| `npm run typecheck` | Run TypeScript with no emit |

## Project Structure

```
app/                 # Next.js App Router pages
components/          # React components, including shadcn/ui
components/ui/       # shadcn/ui components
lib/                 # API clients, helpers, and utility functions
types/               # Shared TypeScript types
public/              # Static assets
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Base URL of the ecom-api (default: `http://localhost:3000`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key for checkout |

## Notes

- Guest carts support adding items, but update/remove/clear require a logged-in user because the Fastify API's cart endpoints for those actions are authenticated-only.
- The `tw-animate-css` and `shadcn/tailwind.css` imports are used by the shadcn base-nova style and require Tailwind CSS v4.
