
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

DROP POLICY "anyone can submit request" ON public.client_requests;
CREATE POLICY "anyone can submit request" ON public.client_requests
  FOR INSERT TO anon, authenticated
  WITH CHECK (length(coalesce(name,'')) > 0 AND length(coalesce(email,'')) > 3 AND length(coalesce(brief,'')) > 0);
