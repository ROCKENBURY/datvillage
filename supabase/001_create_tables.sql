-- ============================================================
-- DatVillage — Schema inicial
-- Rodar no SQL Editor do Supabase (supabase.com → projeto → SQL Editor)
-- ============================================================

-- 1. PLAYERS — perfil e estado do jogador
create table if not exists players (
  id uuid primary key references auth.users(id) on delete cascade,
  name text unique not null,
  level int not null default 1,
  xp bigint not null default 0,
  hp int not null default 100,
  max_hp int not null default 100,
  mana int not null default 50,
  max_mana int not null default 50,
  gold_carried bigint not null default 0,
  gold_bank bigint not null default 0,
  position_x float not null default 0,
  position_y float not null default 1.7,
  position_z float not null default 0,
  rotation_y float not null default 0,
  current_zone text not null default 'village',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. ITEMS_CATALOG — catálogo de itens (read-only para jogadores)
create table if not exists items_catalog (
  id text primary key,
  name text not null,
  description text not null default '',
  tier text not null default 'T1',
  rarity text not null default 'common'
    check (rarity in ('common', 'uncommon', 'rare', 'epic', 'legendary')),
  equip_slot text default null
    check (equip_slot in (null, 'weapon', 'armor', 'amulet')),
  attack int not null default 0,
  defense int not null default 0,
  sell_price int not null default 0,
  stackable bool not null default false,
  max_stack int not null default 1,
  icon_color text not null default '#AAAAAA'
);

-- 3. INVENTORY — itens que o jogador possui
create table if not exists inventory (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references players(id) on delete cascade,
  item_id text not null references items_catalog(id),
  quantity int not null default 1,
  slot int not null default 0,
  equipped bool not null default false,
  created_at timestamptz not null default now()
);

-- 4. PROPERTIES — casas/propriedades no mundo
create table if not exists properties (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references players(id) on delete set null,
  house_key text unique not null,
  price int not null default 1000,
  purchased_at timestamptz
);

-- 5. FARMS — instalações de produção em propriedades
create table if not exists farms (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references players(id) on delete cascade,
  property_id uuid not null references properties(id) on delete cascade,
  farm_type text not null
    check (farm_type in ('chicken_coop', 'vegetable_patch', 'forge')),
  last_collected_at timestamptz not null default now(),
  installed_at timestamptz not null default now()
);

-- Índices para queries frequentes
create index if not exists idx_inventory_player on inventory(player_id);
create index if not exists idx_farms_player on farms(player_id);
create index if not exists idx_properties_player on properties(player_id);
