
DROP VIEW IF EXISTS public.public_site_settings;

CREATE VIEW public.public_site_settings
WITH (security_invoker = true) AS
SELECT id, roster_visible_fields, developer_credit_url, developer_credit_name, updated_at
FROM public.site_settings;

CREATE POLICY "anon read public site settings columns"
ON public.site_settings FOR SELECT
TO anon, authenticated
USING (true);

-- Restrict what anon/authenticated can actually project from site_settings directly
REVOKE SELECT ON public.site_settings FROM anon, authenticated;
GRANT SELECT (id, roster_visible_fields, developer_credit_url, developer_credit_name, updated_at)
  ON public.site_settings TO anon, authenticated;
-- Admins reading via app still work: admins query with authenticated role + column list.
-- For full-row admin reads, keep service_role access:
GRANT ALL ON public.site_settings TO service_role;
GRANT SELECT ON public.public_site_settings TO anon, authenticated;
