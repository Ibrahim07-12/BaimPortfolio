alter table public.chat_messages
  add column if not exists provider text;

update public.chat_messages
set provider = case when is_host then 'host' else 'github' end
where provider is null;

alter table public.chat_messages
  alter column provider set default 'github',
  alter column provider set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'chat_messages_provider_check'
      and conrelid = 'public.chat_messages'::regclass
  ) then
    alter table public.chat_messages
      add constraint chat_messages_provider_check
      check (provider in ('github', 'google', 'host'));
  end if;
end
$$;

drop policy if exists "Signed-in guests can send messages" on public.chat_messages;
create policy "Signed-in guests can send messages"
  on public.chat_messages for insert to authenticated
  with check (
    auth.uid() = user_id
    and is_host = false
    and provider = (auth.jwt() -> 'app_metadata' ->> 'provider')
  );