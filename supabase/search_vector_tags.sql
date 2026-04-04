-- =============================================
-- Fix: Include tags in search_vector via triggers
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. Drop generated column, replace with manually maintained one
ALTER TABLE sounds DROP COLUMN search_vector;
ALTER TABLE sounds ADD COLUMN search_vector tsvector;
CREATE INDEX sounds_search_idx ON sounds USING gin(search_vector);

-- 2. Function to build search_vector for a sound (title + description + tags)
CREATE OR REPLACE FUNCTION build_search_vector(p_sound_id uuid)
RETURNS tsvector LANGUAGE sql STABLE AS $$
  SELECT to_tsvector('english',
    coalesce(s.title, '') || ' ' ||
    coalesce(s.description, '') || ' ' ||
    coalesce((
      SELECT string_agg(t.name, ' ')
      FROM sound_tags st
      JOIN tags t ON t.id = st.tag_id
      WHERE st.sound_id = p_sound_id
    ), '')
  )
  FROM sounds s
  WHERE s.id = p_sound_id;
$$;

-- 3. Trigger function (handles both sounds and sound_tags changes)
CREATE OR REPLACE FUNCTION sync_sound_search_vector()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  v_sound_id uuid;
BEGIN
  v_sound_id := CASE
    WHEN TG_TABLE_NAME = 'sounds' THEN NEW.id
    ELSE COALESCE(NEW.sound_id, OLD.sound_id)
  END;
  UPDATE sounds SET search_vector = build_search_vector(v_sound_id) WHERE id = v_sound_id;
  RETURN NEW;
END;
$$;

-- 4. Trigger: rebuild when sound title/description changes
CREATE TRIGGER trg_sounds_search_vector
  AFTER INSERT OR UPDATE OF title, description ON sounds
  FOR EACH ROW EXECUTE FUNCTION sync_sound_search_vector();

-- 5. Trigger: rebuild when tags are linked/unlinked from a sound
CREATE TRIGGER trg_sound_tags_search_vector
  AFTER INSERT OR DELETE ON sound_tags
  FOR EACH ROW EXECUTE FUNCTION sync_sound_search_vector();

-- 6. Backfill existing sounds
UPDATE sounds SET search_vector = build_search_vector(id);
