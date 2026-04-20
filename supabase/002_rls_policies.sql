-- ============================================================
-- Row Level Security (RLS) — cada jogador só acessa seus dados
-- Rodar DEPOIS de 001_create_tables.sql
-- ============================================================

-- Ativa RLS em todas as tabelas
alter table players enable row level security;
alter table inventory enable row level security;
alter table items_catalog enable row level security;
alter table properties enable row level security;
alter table farms enable row level security;

-- === PLAYERS ===
-- Jogador lê seu próprio perfil
create policy "players_select_own" on players
  for select using (auth.uid() = id);

-- Jogador insere seu próprio perfil (no signup)
create policy "players_insert_own" on players
  for insert with check (auth.uid() = id);

-- Jogador atualiza seu próprio perfil
create policy "players_update_own" on players
  for update using (auth.uid() = id);

-- === INVENTORY ===
-- Jogador lê seu próprio inventário
create policy "inventory_select_own" on inventory
  for select using (auth.uid() = player_id);

-- Jogador insere itens no próprio inventário
create policy "inventory_insert_own" on inventory
  for insert with check (auth.uid() = player_id);

-- Jogador atualiza itens do próprio inventário
create policy "inventory_update_own" on inventory
  for update using (auth.uid() = player_id);

-- Jogador deleta itens do próprio inventário
create policy "inventory_delete_own" on inventory
  for delete using (auth.uid() = player_id);

-- === ITEMS_CATALOG ===
-- Todos autenticados podem ler o catálogo (read-only)
create policy "catalog_select_authenticated" on items_catalog
  for select using (auth.role() = 'authenticated');

-- === PROPERTIES ===
-- Qualquer autenticado pode ver propriedades (pra saber quais estão à venda)
create policy "properties_select_all" on properties
  for select using (auth.role() = 'authenticated');

-- Jogador pode atualizar propriedade (comprar/vender)
create policy "properties_update_authenticated" on properties
  for update using (auth.role() = 'authenticated');

-- === FARMS ===
-- Jogador lê suas próprias farms
create policy "farms_select_own" on farms
  for select using (auth.uid() = player_id);

-- Jogador insere farm própria
create policy "farms_insert_own" on farms
  for insert with check (auth.uid() = player_id);

-- Jogador atualiza farm própria
create policy "farms_update_own" on farms
  for update using (auth.uid() = player_id);

-- Jogador deleta farm própria
create policy "farms_delete_own" on farms
  for delete using (auth.uid() = player_id);
