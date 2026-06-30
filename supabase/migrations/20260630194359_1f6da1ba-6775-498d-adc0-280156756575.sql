
-- Public read for avatars + covers; owner-write paths use {user_id}/...
CREATE POLICY "public read avatars" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'avatars');
CREATE POLICY "public read covers" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'covers');

CREATE POLICY "owner manage avatars" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1])
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "owner manage covers" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'covers' AND auth.uid()::text = (storage.foldername(name))[1])
  WITH CHECK (bucket_id = 'covers' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "admins manage avatars" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'avatars' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'avatars' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage covers" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'covers' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'covers' AND public.has_role(auth.uid(), 'admin'));
