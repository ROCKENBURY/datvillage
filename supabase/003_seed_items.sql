-- ============================================================
-- Seed: catálogo inicial de ~20 itens
-- Rodar DEPOIS de 001 e 002
-- ============================================================

insert into items_catalog (id, name, description, tier, rarity, equip_slot, attack, defense, sell_price, stackable, max_stack, icon_color) values

-- === MOEDAS (stackable, sem equip) ===
('gold_coin',       'Moeda de Ouro',      'A moeda padrão do vilarejo.',              'T1', 'common',    null,     0, 0,   1, true, 9999, '#FFD700'),
('platinum_coin',   'Moeda de Platina',    'Vale 100 moedas de ouro.',                 'T2', 'uncommon',  null,     0, 0, 100, true, 9999, '#E5E4E2'),
('crystal_coin',    'Moeda de Cristal',    'Moeda rara, vale 1000 de ouro.',           'T3', 'rare',      null,     0, 0,1000, true, 9999, '#A8D8EA'),

-- === DROPS DE MOBS (stackable, sem equip) ===
('chicken_feather', 'Pena de Galinha',     'Pena macia. Usada em flechas e travesseiros.', 'T1', 'common',  null,   0, 0,   2, true, 99, '#F5F0DC'),
('pig_leather',     'Couro de Porco',      'Couro grosseiro. Serve pra armaduras simples.','T1', 'common',  null,   0, 0,   5, true, 99, '#C4956A'),
('wolf_fang',       'Presa de Lobo',       'Afiada e intimidadora.',                   'T2', 'uncommon',  null,     0, 0,  15, true, 50, '#E0D8CC'),
('orc_axe',         'Machado Orc',         'Machado bruto tomado de um orc.',          'T2', 'uncommon', 'weapon', 12, 0,  40, false, 1, '#6B8E23'),
('troll_hide',      'Pele de Troll',       'Couro espesso e resistente.',              'T3', 'rare',      null,     0, 0,  60, true, 30, '#556B2F'),
('dragon_scale',    'Escama de Dragão',    'Material lendário, quase indestrutível.',  'T4', 'legendary', null,     0, 0, 500, true, 10, '#8B0000'),

-- === ARMAS ===
('short_sword',     'Espada Curta',        'Lâmina simples, boa pra iniciantes.',      'T1', 'common',   'weapon',  5, 0,  10, false, 1, '#A0A0A0'),
('iron_sword',      'Espada de Ferro',     'Lâmina sólida de ferro forjado.',          'T2', 'uncommon', 'weapon', 10, 0,  35, false, 1, '#808080'),
('steel_sword',     'Espada de Aço',       'Aço temperado, corte preciso.',            'T3', 'rare',     'weapon', 18, 0,  80, false, 1, '#C0C0C0'),
('dragon_blade',    'Lâmina do Dragão',    'Forjada com escamas de dragão.',           'T4', 'legendary','weapon', 35, 5, 500, false, 1, '#FF4500'),

-- === ARMADURAS ===
('leather_armor',   'Armadura de Couro',   'Proteção básica, leve e flexível.',        'T1', 'common',   'armor',   0, 5,  12, false, 1, '#8B6914'),
('chain_armor',     'Cota de Malha',       'Anéis de ferro entrelaçados.',             'T2', 'uncommon', 'armor',   0,12,  45, false, 1, '#A9A9A9'),
('plate_armor',     'Armadura de Placas',  'Proteção pesada de aço.',                  'T3', 'rare',     'armor',   0,22, 120, false, 1, '#708090'),
('dragon_armor',    'Armadura Dragônica',  'Feita de escamas de dragão fundidas.',     'T4', 'legendary','armor',   5,40, 800, false, 1, '#8B0000'),

-- === AMULETOS ===
('wooden_amulet',   'Amuleto de Madeira',  'Talismã simples, leve proteção mágica.',   'T1', 'common',  'amulet',  0, 2,   8, false, 1, '#A0522D'),
('silver_amulet',   'Amuleto de Prata',    'Proteção moderada contra magia.',          'T2', 'uncommon','amulet',  0, 6,  30, false, 1, '#C0C0C0'),
('crystal_amulet',  'Amuleto de Cristal',  'Cristal puro que amplifica mana.',         'T3', 'rare',    'amulet',  3,10,  90, false, 1, '#87CEEB'),
('dragon_amulet',   'Amuleto do Dragão',   'Pulsa com energia ancestral.',             'T4', 'legendary','amulet',10,15, 600, false, 1, '#FF6347')

on conflict (id) do nothing;
