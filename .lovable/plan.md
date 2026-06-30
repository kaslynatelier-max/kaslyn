## Kaslyn Atelier — Full Production Build

Large scope. Approving this plan kicks off the full build in sequence.

### 1. Branding & Navigation polish
- Remove logo image top-left; keep wordmark **KASLYN** only (drop "ATELIER" everywhere in nav).
- Desktop: wordmark top-left. Mobile: wordmark centered.
- Add mobile hamburger (Sheet) with full nav + Book Talent CTA.
- Rename "AI Talent Matcher" → "Talent Matcher" (keep AI logic). Background of matcher block → terracotta orange.
- Orange background on the "Premium Royal Standard" services-preview section (the one before model roster).

### 2. Homepage media
- Replace hero background video with a Ken-Burns animated stack of high-aesthetic editorial images (cross-fading, slow zoom). Stronger overlay gradient so hero copy stays readable on every frame.
- Move the hero MP4 into the second section, embedded above "Data-Driven Beauty, Tailored to You."

### 3. Auth (Lovable Cloud)
- Enable email/password + Google auth (default).
- Seed admin: `kaslyn@admin.com / root` via migration + `supabaseAdmin.auth.admin.createUser` in a one-shot server fn (or directly insert).
- `profiles` table (name, age, phone, height, skin_tone, bio, avatar_url, cover_url, preferences jsonb, is_public, saved_to_roster bool).
- `user_roles` table + `has_role()` security-definer (admin/model/client enum).
- `client_requests` table (name, email, project_type, brief, status, admin_reply, replied_at).
- Storage buckets: `avatars` (public), `covers` (public).
- RLS + GRANTs per Lovable rules.

### 4. New routes
- `/auth` — sign in / sign up (email+Google).
- `/_authenticated/profile` — edit profile, upload avatar + cover, preferences, "Add me to public roster" toggle.
- `/portfolio` — public: previous works, collaborations, social links, services grid.
- `/_authenticated/admin` (gated by `has_role('admin')`):
  - Models tab: list public-roster profiles, approve/remove, edit.
  - Requests tab: inbox of client briefs; click → reply via mailto (opens email client prefilled).
  - Stats: counts.

### 5. Talent / Roster
- `/talent` shows static MODELS **+** approved user profiles (where `saved_to_roster=true` & admin-approved).
- Talent Matcher feeds both static + dynamic roster to the AI.

### 6. SEO
- Per-route titles/descriptions audit, OG/Twitter cards, JSON-LD Organization on root, canonical tags, updated sitemap.xml with all new routes, alt text everywhere.

### 7. Misc functionality
- Toast feedback on all forms, loading states, error boundaries already in place verified.
- Footer: socials, quick links, address.
- Contact form writes to `client_requests` (so admin sees it) in addition to confirmation.

### Technical notes
- Server fns under `src/lib/*.functions.ts` with `requireSupabaseAuth` where needed; admin actions check `has_role`.
- Use `createServerFn` for all DB writes; storage uploads via browser client with RLS.
- Google OAuth via `lovable.auth.signInWithOAuth("google", ...)` + `supabase--configure_social_auth`.
- New images for hero stack generated via imagegen (premium fashion editorial, 3-4 stills).

Approve to proceed — I'll execute end-to-end and report verification at the end.
