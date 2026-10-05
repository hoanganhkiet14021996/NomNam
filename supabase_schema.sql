-- ═══════════════════════════════════════════════════════════════════
-- NomNam (trước đây: CaliTrack) — Supabase schema (chạy 1 lần trong Supabase → SQL Editor)
-- Mỗi bảng có RLS: user chỉ đọc/ghi được dữ liệu của chính mình.
-- Client tạo id (uuid) và updated_at; xoá = soft delete (deleted_at).
-- ═══════════════════════════════════════════════════════════════════

-- Bảng của bản draft cũ (chưa từng được app ghi dữ liệu). Bỏ comment nếu muốn dọn:
-- drop table if exists meal_logs, food_dictionary, user_profiles;

create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  sex text not null default 'male',
  age int not null default 25,
  height_cm double precision not null default 170,
  weight_kg double precision not null default 65,
  neat double precision not null default 1.375,
  goal text not null default 'bulk',
  protein_per_kg double precision not null default 2.0,
  overrides jsonb not null default '{}'::jsonb,
  exercise_eat_back_pct double precision not null default 50,
  updated_at timestamptz not null default now()
);

create table if not exists food_logs (
  id uuid primary key,
  user_id uuid not null references auth.users on delete cascade default auth.uid(),
  date date not null,
  meal text not null,
  name text not null,
  emoji text not null default '🍽️',
  food_id text,
  grams double precision not null default 0,
  serving_label text,
  source text not null default 'db',
  kcal double precision not null default 0,
  protein double precision not null default 0,
  carbs double precision not null default 0,
  fat double precision not null default 0,
  fiber double precision not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index if not exists food_logs_user_date on food_logs (user_id, date);
create index if not exists food_logs_user_updated on food_logs (user_id, updated_at);

create table if not exists activity_logs (
  id uuid primary key,
  user_id uuid not null references auth.users on delete cascade default auth.uid(),
  date date not null,
  activity_id text not null,
  name text not null,
  emoji text not null default '⏱️',
  minutes double precision not null default 0,
  intensity text not null default 'moderate',
  met double precision not null default 0,
  kcal double precision not null default 0,
  manual boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index if not exists activity_logs_user_updated on activity_logs (user_id, updated_at);

create table if not exists weight_logs (
  id uuid primary key,
  user_id uuid not null references auth.users on delete cascade default auth.uid(),
  date date not null,
  kg double precision not null,
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index if not exists weight_logs_user_updated on weight_logs (user_id, updated_at);

create table if not exists saved_meals (
  id uuid primary key,
  user_id uuid not null references auth.users on delete cascade default auth.uid(),
  name text not null,
  items jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists custom_foods (
  id uuid primary key,
  user_id uuid not null references auth.users on delete cascade default auth.uid(),
  name text not null,
  emoji text not null default '🍽️',
  category text not null default 'dish',
  per100 jsonb not null,
  servings jsonb not null default '[]'::jsonb,
  default_grams double precision not null default 100,
  aliases jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- ── Row Level Security ───────────────────────────────────────────────
alter table profiles enable row level security;
alter table food_logs enable row level security;
alter table activity_logs enable row level security;
alter table weight_logs enable row level security;
alter table saved_meals enable row level security;
alter table custom_foods enable row level security;

drop policy if exists "own profile" on profiles;
create policy "own profile" on profiles
  for all using (id = auth.uid()) with check (id = auth.uid());

do $$
declare t text;
begin
  foreach t in array array['food_logs','activity_logs','weight_logs','saved_meals','custom_foods'] loop
    execute format('drop policy if exists "own rows" on %I', t);
    execute format(
      'create policy "own rows" on %I for all using (user_id = auth.uid()) with check (user_id = auth.uid())', t);
  end loop;
end $$;
