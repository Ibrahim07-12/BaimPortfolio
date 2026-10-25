create extension if not exists pgcrypto;

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid references auth.users(id) on delete set null,
  display_name text not null,
  content text not null check (char_length(content) between 1 and 1000),
  is_host boolean not null default false,
  reply_to uuid references public.chat_messages(id) on delete set null,
  provider text not null check (provider in ('github', 'google', 'host'))
);

create table if not exists public.chat_reactions (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.chat_messages(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  emoji text not null check (emoji in ('❤️', '😂', '👍')),
  created_at timestamptz not null default now(),
  unique (message_id, user_id, emoji)
);

alter table public.chat_messages enable row level security;
alter table public.chat_reactions enable row level security;

grant select on public.chat_messages to anon, authenticated;
grant insert on public.chat_messages to authenticated;
grant select on public.chat_reactions to anon, authenticated;
grant insert, delete on public.chat_reactions to authenticated;

create policy "Anyone can read chat messages"
  on public.chat_messages for select
  using (true);

create policy "Signed-in guests can send messages"
  on public.chat_messages for insert to authenticated
  with check (
    auth.uid() = user_id
    and is_host = false
    and provider = (auth.jwt() -> 'app_metadata' ->> 'provider')
  );

create policy "Anyone can read chat reactions"
  on public.chat_reactions for select
  using (true);

create policy "Guests can react as themselves"
  on public.chat_reactions for insert to authenticated
  with check (auth.uid() = user_id);

create policy "Guests can remove their own reactions"
  on public.chat_reactions for delete to authenticated
  using (auth.uid() = user_id);

alter publication supabase_realtime add table public.chat_messages;
alter publication supabase_realtime add table public.chat_reactions;