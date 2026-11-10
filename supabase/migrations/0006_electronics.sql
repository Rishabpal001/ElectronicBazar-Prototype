-- 0006_electronics.sql  (Electronic Bazar: extra product details)
-- Safe to run once on top of 0001-0005. Nothing is removed; three optional columns are added.

alter table public.products add column if not exists brand text;
alter table public.products add column if not exists warranty text;
-- Key specs shown as small tiles on the product page: [{"label":"Camera","value":"200MP"}, ...]
alter table public.products add column if not exists highlights jsonb not null default '[]'::jsonb;

alter table public.products drop constraint if exists products_highlights_is_array;
alter table public.products add constraint products_highlights_is_array check (jsonb_typeof(highlights) = 'array' and jsonb_array_length(highlights) <= 8);

create index if not exists products_brand_idx on public.products (brand) where brand is not null;
create index if not exists products_sale_idx on public.products (sale_price_minor) where sale_price_minor is not null;
