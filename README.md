# Arteez Collection

Arteez Collection is a production-ready women’s suit storefront built with Next.js App Router, Supabase, Tailwind CSS, and TypeScript, using WhatsApp as the primary inquiry channel.

## Stack

- Next.js 16 App Router
- Supabase Auth + Postgres + Storage
- Tailwind CSS v4
- Zustand for client-side bag and recently viewed state
- Zod validation for forms and APIs

## Features

- Premium storefront with homepage, catalog, search, filters, product detail, recommendations, and recently viewed products
- Wishlist backed by Supabase for authenticated users
- Hybrid bag flow: guest-friendly local persistence plus automatic sync to Supabase for signed-in users
- WhatsApp-first inquiry flow from product pages and the bag page, with prefilled product details
- My Orders pages for historical order records already linked to customer accounts
- Protected admin dashboard with revenue/order metrics, product CRUD, inventory management, and order status updates
- Supabase SQL migration, row-level security policies, storage bucket policies, and seed data

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment file and fill in the values:

   ```bash
   cp .env.example .env.local
   ```

3. Create a Supabase project and run the SQL files in order:

   - [`supabase/migrations/20260513010100_initial_schema.sql`](/Users/sid/Webstorm/ac/supabase/migrations/20260513010100_initial_schema.sql)
   - [`supabase/seed.sql`](/Users/sid/Webstorm/ac/supabase/seed.sql)

4. Promote your first store owner account after sign-up:

   ```sql
   update public.profiles
   set role = 'admin'
   where email = 'you@example.com';
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Verify the production build:

   ```bash
   npm run lint
   npm run build
   ```

## Required Environment Variables

- `NEXT_PUBLIC_SITE_URL`: public site URL, for example `https://arteezcollection.in`
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Supabase publishable anon key
- `SUPABASE_SECRET_KEY`: Supabase secret/service-role key for admin operations and no-verification account creation
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: support number used for storefront chat links

## Supabase Notes

- Auth users are mirrored into `public.profiles` through a trigger.
- Customer sign-up uses the service role to create confirmed accounts immediately, so email verification is not required.
- Product images are stored in a public `products` storage bucket.
- Inventory is tracked per size in `public.product_sizes`; product stock is synced automatically by trigger.
- In Supabase Auth URL Configuration, set the Site URL to `https://arteezcollection.in` and allow redirects for `https://arteezcollection.in/auth/confirm`.

## Inquiry Flow

- Product pages offer direct WhatsApp inquiries with product name, size, color, quantity, price, and product link.
- The bag page composes a single WhatsApp inquiry with every selected item and the estimated total.
- Guest users can inquire without creating an account.
- Logged-in users still get wishlist sync and bag persistence across sessions.

## Important Paths

- Storefront root: [`app/(shop)`](/Users/sid/Webstorm/ac/app/(shop))
- Admin area: [`app/admin`](/Users/sid/Webstorm/ac/app/admin)
- Server actions: [`app/actions`](/Users/sid/Webstorm/ac/app/actions)
- Supabase clients/types: [`lib/supabase`](/Users/sid/Webstorm/ac/lib/supabase)
- SQL schema and seed data: [`supabase`](/Users/sid/Webstorm/ac/supabase)

## Build Note

The production build script uses webpack (`next build --webpack`) for stable verification in restricted environments.
