-- =============================================
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. Fix search: use 'simple' config instead of 'english'
--    'simple' tokenises without English stemming — correct for transliterated Hindi
CREATE OR REPLACE FUNCTION build_search_vector(p_sound_id uuid)
RETURNS tsvector LANGUAGE sql STABLE AS $$
  SELECT to_tsvector('simple',
    coalesce(s.title, '') || ' ' ||
    coalesce(s.description, '') || ' ' ||
    coalesce((
      SELECT string_agg(t.name, ' ')
      FROM sound_tags st JOIN tags t ON t.id = st.tag_id
      WHERE st.sound_id = p_sound_id
    ), '')
  )
  FROM sounds s WHERE s.id = p_sound_id;
$$;

-- Rebuild all existing search vectors with the corrected config
UPDATE sounds SET search_vector = build_search_vector(id);

-- 2. Tracking RPCs: add SECURITY DEFINER so anon key can call them
--    (anon RLS only has SELECT; these UPDATEs need elevated privileges)
CREATE OR REPLACE FUNCTION increment_play_count(sound_id uuid)
RETURNS void LANGUAGE sql SECURITY DEFINER AS $$
  UPDATE sounds SET play_count = play_count + 1 WHERE id = sound_id;
$$;

CREATE OR REPLACE FUNCTION increment_download_count(sound_id uuid)
RETURNS void LANGUAGE sql SECURITY DEFINER AS $$
  UPDATE sounds SET download_count = download_count + 1 WHERE id = sound_id;
$$;
