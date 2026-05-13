# Arteez Collection

Arteez Collection is a production-ready women’s suit marketplace built with Next.js App Router, Supabase, Razorpay, Tailwind CSS, and TypeScript.

## Stack

- Next.js 16 App Router
- Supabase Auth + Postgres + Storage
- Razorpay checkout + backend verification
- Tailwind CSS v4
- Zustand for client-side bag and recently viewed state
- Zod validation for forms and APIs

## Features

- Premium storefront with homepage, catalog, search, filters, product detail, recommendations, and recently viewed products
- Wishlist backed by Supabase for authenticated users
- Hybrid bag flow: guest-friendly local persistence plus automatic sync to Supabase for signed-in users
- Checkout flow with Razorpay order creation, signature verification, failure handling, and webhook reconciliation
- My Orders pages with order history, statuses, and invoice-friendly detail view
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

- `NEXT_PUBLIC_SITE_URL`: public site URL, for example `http://localhost:3000`
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Supabase publishable anon key
- `SUPABASE_SECRET_KEY`: Supabase secret/service-role key for admin operations and webhooks
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`: Razorpay public key
- `RAZORPAY_KEY_SECRET`: Razorpay secret key
- `RAZORPAY_WEBHOOK_SECRET`: webhook secret used by `/api/webhooks/razorpay`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: support number used for storefront chat links

## Supabase Notes

- Auth users are mirrored into `public.profiles` through a trigger.
- Product images are stored in a public `products` storage bucket.
- Inventory is tracked per size in `public.product_sizes`; product stock is synced automatically by trigger.
- Pending orders reserve inventory through the `create_pending_order` RPC and failed payments release inventory with `release_inventory_for_order`.

## Payment Flow

- The checkout page creates a Razorpay order from the server after pricing bag items against the database.
- The app stores a pending order and payment row in Supabase before opening checkout.
- Successful payments are verified server-side and marked paid in both `orders` and `payments`.
- Failed or dismissed checkouts mark the order as failed and restore reserved inventory.
- Webhooks provide an additional reconciliation layer for captured or failed payments.

## Important Paths

- Storefront root: [`app/(shop)`](/Users/sid/Webstorm/ac/app/(shop))
- Admin area: [`app/admin`](/Users/sid/Webstorm/ac/app/admin)
- Server actions: [`app/actions`](/Users/sid/Webstorm/ac/app/actions)
- Supabase clients/types: [`lib/supabase`](/Users/sid/Webstorm/ac/lib/supabase)
- SQL schema and seed data: [`supabase`](/Users/sid/Webstorm/ac/supabase)

## Build Note

The production build script uses webpack (`next build --webpack`) for stable verification in restricted environments.
