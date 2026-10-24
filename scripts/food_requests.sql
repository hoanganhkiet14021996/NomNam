-- Chạy 1 lần trong Supabase → SQL Editor. Chỉ TẠO bảng mới food_requests + RLS, không đụng bảng nào khác
-- (project dùng chung với app CFO nên các bảng fin_* không bị ảnh hưởng). Chạy lại nhiều lần cũng an toàn.
create table if not exists food_requests (
  id uuid primary key,
  user_id uuid not null references auth.users on delete cascade default auth.uid(),
  name text not null,
  name_key text not null,
  emoji text not null default '🍽️',
  role text not null default 'other',
  kind text not null default '',
  cooking text not null default 'other',
  per100 jsonb not null,
  grams double precision not null default 0,
  times_seen int not null default 1,
  status text not null default 'pending',
  food_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index if not exists food_requests_user_updated on food_requests (user_id, updated_at);

alter table food_requests enable row level security;
drop policy if exists "own rows" on food_requests;
create policy "own rows" on food_requests
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
