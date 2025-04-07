
-- Function to save a transliteration to the database
CREATE OR REPLACE FUNCTION public.save_transliteration(
  original_text_param TEXT,
  language_param TEXT,
  transliterated_text_param TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.transliterations (original_text, language, transliterated_text)
  VALUES (original_text_param, language_param, transliterated_text_param)
  ON CONFLICT (original_text, language) 
  DO UPDATE SET transliterated_text = transliterated_text_param;
END;
$$;
