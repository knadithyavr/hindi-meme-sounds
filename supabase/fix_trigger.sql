-- Fix: replace CASE with IF/ELSIF — guaranteed lazy evaluation in PL/pgSQL
CREATE OR REPLACE FUNCTION sync_sound_search_vector()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  v_sound_id uuid;
BEGIN
  IF TG_TABLE_NAME = 'sounds' THEN
    v_sound_id := NEW.id;
  ELSIF TG_OP = 'DELETE' THEN
    v_sound_id := OLD.sound_id;
  ELSE
    v_sound_id := NEW.sound_id;
  END IF;

  UPDATE sounds
  SET search_vector = build_search_vector(v_sound_id)
  WHERE id = v_sound_id;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$;
