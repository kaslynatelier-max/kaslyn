
-- 1. profiles: replace broad public policy with a safe view
DROP POLICY IF EXISTS "public can view approved public profiles" ON public.profiles;

CREATE OR REPLACE VIEW public.public_roster_profiles
WITH (security_invoker = true) AS
SELECT id, roster_code, city, avatar_url, cover_url
FROM public.profiles
WHERE is_public = true AND approved = true;

-- Need a narrow SELECT policy so the view (running as invoker) can read the rows
CREATE POLICY "public roster columns only via view"
ON public.profiles FOR SELECT
TO anon, authenticated
USING (is_public = true AND approved = true);

-- Revoke direct column access from anon; grant only via view
REVOKE SELECT ON public.profiles FROM anon;
GRANT SELECT (id, roster_code, city, avatar_url, cover_url) ON public.profiles TO anon;
GRANT SELECT ON public.public_roster_profiles TO anon, authenticated;

-- 2. site_settings: hide admin_notify_email from public
DROP POLICY IF EXISTS "public read site settings" ON public.site_settings;

CREATE POLICY "admins read site settings"
ON public.site_settings FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE OR REPLACE VIEW public.public_site_settings
WITH (security_invoker = false) AS
SELECT id, roster_visible_fields, developer_credit_url, developer_credit_name, updated_at
FROM public.site_settings;

REVOKE SELECT ON public.site_settings FROM anon;
GRANT SELECT ON public.public_site_settings TO anon, authenticated;

-- 3. Storage: drop duplicate owner policies (keep the ALL "owner manage" policies)
DROP POLICY IF EXISTS "avatars owner write" ON storage.objects;
DROP POLICY IF EXISTS "avatars owner update" ON storage.objects;
DROP POLICY IF EXISTS "avatars owner delete" ON storage.objects;
DROP POLICY IF EXISTS "covers owner write" ON storage.objects;
DROP POLICY IF EXISTS "covers owner update" ON storage.objects;
DROP POLICY IF EXISTS "covers owner delete" ON storage.objects;

-- Also consolidate duplicate public-read policies
DROP POLICY IF EXISTS "avatars public read" ON storage.objects;
DROP POLICY IF EXISTS "covers public read" ON storage.objects;

-- 4. has_role: revoke from anon/public; keep for authenticated (required by RLS)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
