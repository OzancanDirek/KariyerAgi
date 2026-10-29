-- The projects API and form already use this column, but the live table was
-- created before it existed. Existing projects receive an empty list.
alter table public.projeler
    add column if not exists teknolojiler text[] not null default '{}'::text[];
