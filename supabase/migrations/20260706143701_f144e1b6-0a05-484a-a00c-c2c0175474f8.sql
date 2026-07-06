-- Enable extensions for scheduled admin notification delivery
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Remove any prior schedule with the same name
DO $$
BEGIN
  PERFORM cron.unschedule('process-admin-notifications');
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- Poll the notifications processor every minute
SELECT cron.schedule(
  'process-admin-notifications',
  '* * * * *',
  $$
  SELECT net.http_get(
    url := 'https://project--7aa32c35-0e1e-4d7e-90dc-88ca3345fce3.lovable.app/api/public/process-notifications',
    timeout_milliseconds := 15000
  );
  $$
);