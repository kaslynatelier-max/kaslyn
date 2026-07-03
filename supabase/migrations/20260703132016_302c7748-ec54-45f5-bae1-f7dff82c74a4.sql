
-- 1. Profile columns
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS roster_code text UNIQUE,
  ADD COLUMN IF NOT EXISTS weight_kg integer,
  ADD COLUMN IF NOT EXISTS custom_fields jsonb NOT NULL DEFAULT '{}'::jsonb;

-- 2. Roster code generator (KAS#XX where X is 0-9 or A-Z)
CREATE OR REPLACE FUNCTION public.generate_roster_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  d text; l text; code text; attempts int := 0;
BEGIN
  LOOP
    d := chr(48 + floor(random()*10)::int);
    l := chr(65 + floor(random()*26)::int);
    code := 'KAS#' || d || l;
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE roster_code = code) THEN RETURN code; END IF;
    attempts := attempts + 1;
    IF attempts > 500 THEN RETURN 'KAS#' || upper(substr(md5(random()::text), 1, 4)); END IF;
  END LOOP;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.generate_roster_code() FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.set_roster_code()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NEW.roster_code IS NULL THEN NEW.roster_code := public.generate_roster_code(); END IF;
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.set_roster_code() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_profiles_roster_code ON public.profiles;
CREATE TRIGGER trg_profiles_roster_code BEFORE INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_roster_code();

UPDATE public.profiles SET roster_code = public.generate_roster_code() WHERE roster_code IS NULL;

-- 3. Site settings (singleton)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id boolean PRIMARY KEY DEFAULT true CHECK (id = true),
  roster_visible_fields jsonb NOT NULL DEFAULT '["roster_code","city","cover_url","avatar_url"]'::jsonb,
  developer_credit_name text NOT NULL DEFAULT 'Engineer Franck MBOGNE',
  developer_credit_url  text NOT NULL DEFAULT 'https://www.FranckMbogne.dev',
  admin_notify_email    text NOT NULL DEFAULT 'kaslynatelier@gmail.com',
  updated_at timestamptz NOT NULL DEFAULT now()
);
INSERT INTO public.site_settings (id) VALUES (true) ON CONFLICT DO NOTHING;
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT UPDATE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read site settings" ON public.site_settings;
CREATE POLICY "public read site settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "admins update site settings" ON public.site_settings;
CREATE POLICY "admins update site settings" ON public.site_settings FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- 4. Custom profile field defs
CREATE TABLE IF NOT EXISTS public.profile_field_defs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  label text NOT NULL,
  field_type text NOT NULL DEFAULT 'text' CHECK (field_type IN ('text','number','select')),
  options jsonb,
  required boolean NOT NULL DEFAULT false,
  show_in_roster boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profile_field_defs TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.profile_field_defs TO authenticated;
GRANT ALL ON public.profile_field_defs TO service_role;
ALTER TABLE public.profile_field_defs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anyone read field defs" ON public.profile_field_defs;
CREATE POLICY "anyone read field defs" ON public.profile_field_defs FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "admins manage field defs" ON public.profile_field_defs;
CREATE POLICY "admins manage field defs" ON public.profile_field_defs FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

INSERT INTO public.profile_field_defs (key, label, field_type, sort_order) VALUES
  ('weight_kg', 'Weight (kg)', 'number', 10),
  ('bust_cm',   'Bust (cm)',   'number', 20),
  ('waist_cm',  'Waist (cm)',  'number', 30),
  ('hips_cm',   'Hips (cm)',   'number', 40),
  ('shoe_eu',   'Shoe (EU)',   'number', 50)
ON CONFLICT (key) DO NOTHING;

-- 5. Admin notification queue
CREATE TABLE IF NOT EXISTS public.admin_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL,
  subject text NOT NULL,
  body text NOT NULL,
  sent boolean NOT NULL DEFAULT false,
  error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  sent_at timestamptz
);
GRANT ALL ON public.admin_notifications TO service_role;
GRANT SELECT ON public.admin_notifications TO authenticated;
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admins read notifications" ON public.admin_notifications;
CREATE POLICY "admins read notifications" ON public.admin_notifications FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- 6. handle_new_user updated: super_admin for root@admin.com, enqueue signup notification
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)))
  ON CONFLICT (id) DO NOTHING;

  IF lower(NEW.email) = 'root@admin.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'super_admin') ON CONFLICT (user_id, role) DO NOTHING;
  ELSIF lower(NEW.email) = 'kaslyn@admin.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin') ON CONFLICT (user_id, role) DO NOTHING;
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'model') ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  INSERT INTO public.admin_notifications (kind, subject, body)
  VALUES ('signup', 'New registration on Kaslyn Atelier',
    'New user just registered: ' || COALESCE(NEW.email, '(no email)'));

  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. client_requests notification trigger
CREATE OR REPLACE FUNCTION public.notify_new_request()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.admin_notifications (kind, subject, body)
  VALUES ('request',
    'New casting brief from ' || COALESCE(NEW.name, 'client'),
    'From: ' || COALESCE(NEW.name,'') || ' <' || COALESCE(NEW.email,'') || E'>\nBrand: ' || COALESCE(NEW.brand,'-') ||
    E'\nProject: ' || COALESCE(NEW.project_type,'-') || E'\n\n' || COALESCE(NEW.brief,''));
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_notify_new_request ON public.client_requests;
CREATE TRIGGER trg_notify_new_request AFTER INSERT ON public.client_requests
  FOR EACH ROW EXECUTE FUNCTION public.notify_new_request();

-- 8. Extend has_role: super_admin implicitly has all roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND (role = _role OR role = 'super_admin')
  )
$$;

-- 9. Storage RLS for avatars + covers (owner writes to their own uid folder, public read)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='avatars public read') THEN
    CREATE POLICY "avatars public read" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'avatars');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='covers public read') THEN
    CREATE POLICY "covers public read" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'covers');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='avatars owner write') THEN
    CREATE POLICY "avatars owner write" ON storage.objects FOR INSERT TO authenticated
      WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='avatars owner update') THEN
    CREATE POLICY "avatars owner update" ON storage.objects FOR UPDATE TO authenticated
      USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='avatars owner delete') THEN
    CREATE POLICY "avatars owner delete" ON storage.objects FOR DELETE TO authenticated
      USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='covers owner write') THEN
    CREATE POLICY "covers owner write" ON storage.objects FOR INSERT TO authenticated
      WITH CHECK (bucket_id = 'covers' AND (storage.foldername(name))[1] = auth.uid()::text);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='covers owner update') THEN
    CREATE POLICY "covers owner update" ON storage.objects FOR UPDATE TO authenticated
      USING (bucket_id = 'covers' AND (storage.foldername(name))[1] = auth.uid()::text);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='covers owner delete') THEN
    CREATE POLICY "covers owner delete" ON storage.objects FOR DELETE TO authenticated
      USING (bucket_id = 'covers' AND (storage.foldername(name))[1] = auth.uid()::text);
  END IF;
END $$;
