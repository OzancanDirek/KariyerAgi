begin;

create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net with schema extensions;

-- Create the Vault secrets careerpath_account_purge_cron and
-- careerpath_account_purge_anon_key before enabling this job.
-- Never put either value in a migration or Git. The second value is the
-- project's legacy anon JWT, required while Edge Function JWT verification is on.
select cron.schedule(
  'careerpath-purge-closed-accounts',
  '0 3 * * *',
  $$
    select net.http_post(
      url := 'https://ylpvawafczdbawdwdiep.supabase.co/functions/v1/account-purge',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || (
          select decrypted_secret from vault.decrypted_secrets
          where name = 'careerpath_account_purge_anon_key'
        ),
        'x-cron-secret', (
          select decrypted_secret from vault.decrypted_secrets
          where name = 'careerpath_account_purge_cron'
        )
      ),
      body := '{}'::jsonb
    );
  $$
);

commit;
