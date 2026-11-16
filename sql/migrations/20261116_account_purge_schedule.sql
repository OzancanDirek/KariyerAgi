begin;

create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net with schema extensions;

-- Create the Vault secret named careerpath_account_purge_cron in the dashboard
-- before enabling this job. Do not put its value in a migration or Git.
select cron.schedule(
  'careerpath-purge-closed-accounts',
  '0 3 * * *',
  $$
    select net.http_post(
      url := 'https://ylpvawafczdbawdwdiep.supabase.co/functions/v1/account-purge',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
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
