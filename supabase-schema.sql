-- ============================================================
-- CHARCOAL CHICKEN — Full Reset Schema
-- Run this in: Supabase Dashboard > SQL Editor
-- ============================================================

-- Drop existing table if re-running
drop table if exists menu_items;

-- Create menu items table with image support
create table menu_items (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text not null,
  price numeric(10,2) not null,
  category text not null check (category in ('signature','sides','drinks','desserts')),
  image_url text,
  tag text,
  available boolean not null default true,
  created_at timestamptz default now()
);

-- Enable RLS
alter table menu_items enable row level security;

-- Anyone can read available menu items (public website)
create policy "Public read"
  on menu_items for select
  using (true);

-- Anyone can insert/update/delete (we protect via admin password in the app)
-- For production, replace with Supabase Auth
create policy "Admin full access"
  on menu_items for all
  using (true)
  with check (true);

-- ============================================================
-- Storage bucket for menu images
-- ============================================================
insert into storage.buckets (id, name, public)
values ('menu-images', 'menu-images', true)
on conflict (id) do nothing;

-- Allow public to view images
create policy "Public image read"
  on storage.objects for select
  using (bucket_id = 'menu-images');

-- Allow uploads (admin)
create policy "Admin image upload"
  on storage.objects for insert
  with check (bucket_id = 'menu-images');

-- Allow delete
create policy "Admin image delete"
  on storage.objects for delete
  using (bucket_id = 'menu-images');

-- ============================================================
-- Seed Data
-- ============================================================
insert into menu_items (name, description, price, category, tag) values
  ('Half Charcoal Chicken', 'Brined 12 hours, roasted over hardwood coals. Crisp skin, juicy meat, served with house gravy.', 22.00, 'signature', 'Best Seller'),
  ('Whole Charcoal Chicken', 'The full bird. Feeds two. Dark, smoky, crackling skin. Our proudest dish.', 38.00, 'signature', 'Signature'),
  ('Chicken Burger', 'Charcoal thigh fillet, pickled slaw, smoky aioli, brioche bun toasted on the grill.', 18.00, 'signature', 'Popular'),
  ('Chicken Wrap', 'Sliced charcoal breast, hummus, roasted capsicum, fresh herb salad in a charred flatbread.', 16.00, 'signature', null),
  ('Hand-Cut Chips', 'Double-fried golden chips. Rosemary salt, house sauce.', 9.00, 'sides', null),
  ('Charred Corn Elote', 'Fire-roasted corn, cotija cheese, chili butter, lime.', 9.00, 'sides', 'Special'),
  ('Roasted Greens', 'Broccolini, kale, garlic chips, lemon oil.', 10.00, 'sides', null),
  ('Charcoal Bread', 'Activated charcoal sourdough, cultured butter, smoked salt.', 8.00, 'sides', null),
  ('Craft Lager', 'Local Melbourne brewery. Crisp, cold, made for grilled meat.', 10.00, 'drinks', null),
  ('House Shiraz', 'Barossa Valley. Smoky oak, dark berry. The natural match for charcoal.', 12.00, 'drinks', 'Pairs Well'),
  ('House Lemonade', 'Pressed lemon, ginger, raw honey. Fresh-made daily.', 6.00, 'drinks', null),
  ('Long Black', 'Single origin Ethiopian beans, espresso over ice or hot.', 5.00, 'drinks', null);
