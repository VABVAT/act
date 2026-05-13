create extension if not exists "pgcrypto";

create type public.app_role as enum ('customer', 'admin');
create type public.order_status as enum ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled');
create type public.payment_status as enum ('pending', 'paid', 'failed', 'refunded');
create type public.discount_type as enum ('percentage', 'flat');
create type public.availability_status as enum ('in_stock', 'out_of_stock');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text not null unique,
  phone text,
  role public.app_role not null default 'customer',
  avatar_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories (id) on delete set null,
  name text not null,
  slug text not null unique,
  description text not null,
  price numeric(10, 2) not null check (price >= 0),
  discounted_price numeric(10, 2) check (discounted_price >= 0 and discounted_price <= price),
  stock integer not null default 0 check (stock >= 0),
  fabric text not null,
  color text not null,
  sku text not null unique,
  delivery_information text not null default 'Ships within 2-4 business days across India.',
  return_policy text not null default 'Return or exchange accepted within 7 days for unused items.',
  featured boolean not null default false,
  is_active boolean not null default true,
  availability_status public.availability_status not null default 'in_stock',
  popularity_score integer not null default 0,
  search_document tsvector generated always as (
    setweight(to_tsvector('simple', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(description, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(fabric, '')), 'C') ||
    setweight(to_tsvector('simple', coalesce(color, '')), 'D') ||
    setweight(to_tsvector('simple', coalesce(sku, '')), 'A')
  ) stored,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  image_url text not null,
  alt_text text,
  display_order integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.product_sizes (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  size text not null,
  quantity integer not null default 0 check (quantity >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  unique (product_id, size)
);

create table public.product_tags (
  id bigint generated always as identity primary key,
  product_id uuid not null references public.products (id) on delete cascade,
  tag text not null,
  unique (product_id, tag)
);

create table public.wishlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  unique (user_id, product_id)
);

create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  selected_size text not null,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, product_id, selected_size)
);

create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  description text,
  discount_type public.discount_type not null,
  value numeric(10, 2) not null check (value >= 0),
  minimum_order_amount numeric(10, 2) not null default 0,
  maximum_discount_amount numeric(10, 2),
  usage_limit integer,
  usage_count integer not null default 0,
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  user_id uuid references public.profiles (id) on delete set null,
  coupon_id uuid references public.coupons (id) on delete set null,
  full_name text not null,
  phone text not null,
  email text not null,
  shipping_address jsonb not null,
  subtotal_amount numeric(10, 2) not null check (subtotal_amount >= 0),
  delivery_fee numeric(10, 2) not null default 0 check (delivery_fee >= 0),
  discount_amount numeric(10, 2) not null default 0 check (discount_amount >= 0),
  total_amount numeric(10, 2) not null check (total_amount >= 0),
  payment_status public.payment_status not null default 'pending',
  order_status public.order_status not null default 'pending',
  razorpay_order_id text unique,
  razorpay_payment_id text unique,
  inventory_released_at timestamptz,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  product_name text not null,
  product_slug text,
  product_sku text,
  image_url text,
  quantity integer not null check (quantity > 0),
  selected_size text not null,
  price numeric(10, 2) not null check (price >= 0),
  created_at timestamptz not null default timezone('utc', now())
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders (id) on delete cascade,
  provider text not null default 'razorpay',
  razorpay_order_id text unique,
  razorpay_payment_id text unique,
  status public.payment_status not null default 'pending',
  amount numeric(10, 2) not null check (amount >= 0),
  currency text not null default 'INR',
  raw_response jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.payment_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'razorpay',
  event_id text not null unique,
  event_type text not null,
  payload jsonb not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.recently_viewed_products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  viewed_at timestamptz not null default timezone('utc', now()),
  unique (user_id, product_id)
);

create index idx_products_active_created_at on public.products (is_active, created_at desc);
create index idx_products_featured on public.products (featured) where is_active = true;
create index idx_products_category on public.products (category_id);
create index idx_products_price on public.products (price);
create index idx_products_availability on public.products (availability_status);
create index idx_products_popularity on public.products (popularity_score desc);
create index idx_products_search_document on public.products using gin (search_document);
create index idx_product_images_product_id on public.product_images (product_id, display_order);
create index idx_product_sizes_product_id on public.product_sizes (product_id);
create index idx_product_tags_product_id on public.product_tags (product_id);
create index idx_wishlist_items_user_id on public.wishlist_items (user_id, created_at desc);
create index idx_cart_items_user_id on public.cart_items (user_id, updated_at desc);
create index idx_orders_user_id on public.orders (user_id, created_at desc);
create index idx_orders_status on public.orders (order_status, payment_status, created_at desc);
create index idx_order_items_order_id on public.order_items (order_id);
create index idx_recently_viewed_user_id on public.recently_viewed_products (user_id, viewed_at desc);

create or replace function public.is_admin(user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = coalesce(user_id, auth.uid())
      and role = 'admin'
  );
$$;

create or replace function public.handle_auth_user_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.email,
    new.raw_user_meta_data ->> 'phone'
  )
  on conflict (id) do update
  set
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    email = excluded.email,
    phone = coalesce(excluded.phone, public.profiles.phone),
    updated_at = timezone('utc', now());

  return new;
end;
$$;

drop trigger if exists on_auth_user_change on auth.users;
create trigger on_auth_user_change
after insert or update of email, raw_user_meta_data
on auth.users
for each row
execute function public.handle_auth_user_change();

create or replace function public.sync_product_stock()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  target_product_id uuid;
  total_stock integer;
begin
  target_product_id = coalesce(new.product_id, old.product_id);

  select coalesce(sum(quantity), 0)
  into total_stock
  from public.product_sizes
  where product_id = target_product_id;

  update public.products
  set
    stock = total_stock,
    availability_status = (
      case
        when total_stock > 0 and is_active then 'in_stock'
        else 'out_of_stock'
      end
    )::public.availability_status,
    updated_at = timezone('utc', now())
  where id = target_product_id;

  return coalesce(new, old);
end;
$$;

drop trigger if exists on_product_size_change on public.product_sizes;
create trigger on_product_size_change
after insert or update or delete
on public.product_sizes
for each row
execute function public.sync_product_stock();

create or replace function public.release_inventory_for_order(target_order_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  item record;
begin
  if exists (
    select 1
    from public.orders
    where id = target_order_id
      and inventory_released_at is not null
  ) then
    return;
  end if;

  for item in
    select product_id, selected_size, quantity
    from public.order_items
    where order_id = target_order_id
      and product_id is not null
  loop
    update public.product_sizes
    set quantity = quantity + item.quantity
    where product_id = item.product_id
      and size = item.selected_size;
  end loop;

  update public.orders
  set inventory_released_at = timezone('utc', now())
  where id = target_order_id
    and inventory_released_at is null;
end;
$$;

create or replace function public.create_pending_order(
  p_order_number text,
  p_user_id uuid,
  p_coupon_id uuid,
  p_full_name text,
  p_phone text,
  p_email text,
  p_shipping_address jsonb,
  p_subtotal_amount numeric,
  p_delivery_fee numeric,
  p_discount_amount numeric,
  p_total_amount numeric,
  p_razorpay_order_id text,
  p_items jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  created_order_id uuid;
  item jsonb;
  product_row record;
  size_row record;
  requested_quantity integer;
begin
  insert into public.orders (
    order_number,
    user_id,
    coupon_id,
    full_name,
    phone,
    email,
    shipping_address,
    subtotal_amount,
    delivery_fee,
    discount_amount,
    total_amount,
    razorpay_order_id
  )
  values (
    p_order_number,
    p_user_id,
    p_coupon_id,
    p_full_name,
    p_phone,
    p_email,
    p_shipping_address,
    p_subtotal_amount,
    p_delivery_fee,
    p_discount_amount,
    p_total_amount,
    p_razorpay_order_id
  )
  returning id into created_order_id;

  for item in
    select value
    from jsonb_array_elements(p_items)
  loop
    requested_quantity = (item ->> 'quantity')::integer;

    select
      p.id,
      p.name,
      p.slug,
      p.sku,
      coalesce(p.discounted_price, p.price) as effective_price,
      (
        select image_url
        from public.product_images
        where product_id = p.id
        order by is_primary desc, display_order asc
        limit 1
      ) as image_url
    into product_row
    from public.products p
    where p.id = (item ->> 'product_id')::uuid
      and p.is_active = true;

    if not found then
      raise exception 'Selected product is unavailable';
    end if;

    select id, quantity
    into size_row
    from public.product_sizes
    where product_id = product_row.id
      and size = (item ->> 'selected_size')
    for update;

    if not found then
      raise exception 'Selected size is unavailable';
    end if;

    if size_row.quantity < requested_quantity then
      raise exception 'Insufficient stock for %', product_row.name;
    end if;

    update public.product_sizes
    set quantity = quantity - requested_quantity
    where id = size_row.id;

    insert into public.order_items (
      order_id,
      product_id,
      product_name,
      product_slug,
      product_sku,
      image_url,
      quantity,
      selected_size,
      price
    )
    values (
      created_order_id,
      product_row.id,
      product_row.name,
      product_row.slug,
      product_row.sku,
      product_row.image_url,
      requested_quantity,
      item ->> 'selected_size',
      product_row.effective_price
    );
  end loop;

  insert into public.payments (
    order_id,
    provider,
    razorpay_order_id,
    status,
    amount,
    currency
  )
  values (
    created_order_id,
    'razorpay',
    p_razorpay_order_id,
    'pending',
    p_total_amount,
    'INR'
  );

  return created_order_id;
end;
$$;

create or replace function public.mark_order_paid(
  target_order_id uuid,
  target_razorpay_payment_id text,
  payment_payload jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  target_coupon_id uuid;
  was_paid boolean;
begin
  select payment_status = 'paid', coupon_id
  into was_paid, target_coupon_id
  from public.orders
  where id = target_order_id;

  update public.orders
  set
    payment_status = 'paid',
    order_status = (
      case
        when order_status = 'cancelled' then order_status::text
        else 'confirmed'
      end
    )::public.order_status,
    razorpay_payment_id = coalesce(target_razorpay_payment_id, razorpay_payment_id),
    updated_at = timezone('utc', now())
  where id = target_order_id;

  update public.payments
  set
    status = 'paid',
    razorpay_payment_id = coalesce(target_razorpay_payment_id, razorpay_payment_id),
    raw_response = coalesce(raw_response, '{}'::jsonb) || coalesce(payment_payload, '{}'::jsonb),
    updated_at = timezone('utc', now())
  where order_id = target_order_id;

  update public.products p
  set popularity_score = popularity_score + sales.total_quantity
  from (
    select product_id, sum(quantity)::integer as total_quantity
    from public.order_items
    where order_id = target_order_id
      and product_id is not null
    group by product_id
  ) sales
  where p.id = sales.product_id;

  if not coalesce(was_paid, false) and target_coupon_id is not null then
    update public.coupons
    set
      usage_count = usage_count + 1,
      updated_at = timezone('utc', now())
    where id = target_coupon_id;
  end if;
end;
$$;

create or replace function public.mark_order_failed(
  target_order_id uuid,
  payment_payload jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.orders
  set
    payment_status = (
      case
        when payment_status = 'paid' then payment_status::text
        else 'failed'
      end
    )::public.payment_status,
    updated_at = timezone('utc', now())
  where id = target_order_id;

  update public.payments
  set
    status = (
      case
        when status = 'paid' then status::text
        else 'failed'
      end
    )::public.payment_status,
    raw_response = coalesce(raw_response, '{}'::jsonb) || coalesce(payment_payload, '{}'::jsonb),
    updated_at = timezone('utc', now())
  where order_id = target_order_id;

  if exists (
    select 1
    from public.orders
    where id = target_order_id
      and payment_status <> 'paid'
  ) then
    perform public.release_inventory_for_order(target_order_id);
  end if;
end;
$$;

create or replace function public.touch_recently_viewed()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.viewed_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_recently_viewed_timestamp on public.recently_viewed_products;
create trigger set_recently_viewed_timestamp
before update
on public.recently_viewed_products
for each row
execute function public.touch_recently_viewed();

create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create trigger set_categories_updated_at
before update on public.categories
for each row
execute function public.set_updated_at();

create trigger set_products_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

create trigger set_cart_items_updated_at
before update on public.cart_items
for each row
execute function public.set_updated_at();

create trigger set_coupons_updated_at
before update on public.coupons
for each row
execute function public.set_updated_at();

create trigger set_orders_updated_at
before update on public.orders
for each row
execute function public.set_updated_at();

create trigger set_payments_updated_at
before update on public.payments
for each row
execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_sizes enable row level security;
alter table public.product_tags enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.cart_items enable row level security;
alter table public.coupons enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.payment_events enable row level security;
alter table public.recently_viewed_products enable row level security;

create policy "Profiles are viewable by owners and admins"
on public.profiles
for select
to authenticated
using (auth.uid() = id or public.is_admin());

create policy "Profiles can be updated by owners and admins"
on public.profiles
for update
to authenticated
using (auth.uid() = id or public.is_admin())
with check (auth.uid() = id or public.is_admin());

create policy "Categories are public"
on public.categories
for select
to public
using (true);

create policy "Admins manage categories"
on public.categories
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Published products are public"
on public.products
for select
to public
using (is_active = true);

create policy "Admins manage products"
on public.products
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Images for published products are public"
on public.product_images
for select
to public
using (
  exists (
    select 1
    from public.products
    where products.id = product_images.product_id
      and products.is_active = true
  )
);

create policy "Admins manage product images"
on public.product_images
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Sizes for published products are public"
on public.product_sizes
for select
to public
using (
  exists (
    select 1
    from public.products
    where products.id = product_sizes.product_id
      and products.is_active = true
  )
);

create policy "Admins manage product sizes"
on public.product_sizes
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Tags for published products are public"
on public.product_tags
for select
to public
using (
  exists (
    select 1
    from public.products
    where products.id = product_tags.product_id
      and products.is_active = true
  )
);

create policy "Admins manage product tags"
on public.product_tags
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Users manage their own wishlist"
on public.wishlist_items
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users manage their own cart"
on public.cart_items
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Coupons are readable by authenticated users"
on public.coupons
for select
to authenticated
using (is_active = true);

create policy "Admins manage coupons"
on public.coupons
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Users view their own orders"
on public.orders
for select
to authenticated
using (auth.uid() = user_id or public.is_admin());

create policy "Admins update orders"
on public.orders
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Users view order items tied to their orders"
on public.order_items
for select
to authenticated
using (
  exists (
    select 1
    from public.orders
    where orders.id = order_items.order_id
      and (orders.user_id = auth.uid() or public.is_admin())
  )
);

create policy "Users view payments tied to their orders"
on public.payments
for select
to authenticated
using (
  exists (
    select 1
    from public.orders
    where orders.id = payments.order_id
      and (orders.user_id = auth.uid() or public.is_admin())
  )
);

create policy "Users manage their recently viewed products"
on public.recently_viewed_products
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

create policy "Public can read product storage objects"
on storage.objects
for select
to public
using (bucket_id = 'products');

create policy "Admins can upload product storage objects"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'products' and public.is_admin());

create policy "Admins can update product storage objects"
on storage.objects
for update
to authenticated
using (bucket_id = 'products' and public.is_admin())
with check (bucket_id = 'products' and public.is_admin());

create policy "Admins can delete product storage objects"
on storage.objects
for delete
to authenticated
using (bucket_id = 'products' and public.is_admin());
