-- ============================================================
-- Função atômica para criar perfil de jogador após signup.
-- Chamada via supabase.rpc('create_player', { player_name: '...' })
-- O auth.uid() já está disponível após o signup do Supabase Auth.
--
-- Cria o registro em players + adiciona short_sword no inventário.
-- Tudo numa transação — se o nome já existir, faz rollback limpo.
-- ============================================================

create or replace function create_player(player_name text)
returns void
language plpgsql
security definer
as $$
begin
  -- Insere o perfil do jogador com stats iniciais
  insert into players (id, name, gold_carried, position_x, position_y, position_z, current_zone)
  values (
    auth.uid(),
    player_name,
    10,       -- gold inicial de starter
    0,        -- posição X: praça central
    1.7,      -- posição Y: altura do jogador
    0,        -- posição Z: praça central
    'village'
  );

  -- Adiciona espada curta no inventário (slot 0)
  insert into inventory (player_id, item_id, quantity, slot, equipped)
  values (auth.uid(), 'short_sword', 1, 0, true);
end;
$$;
