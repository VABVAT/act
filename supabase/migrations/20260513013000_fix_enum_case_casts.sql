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
