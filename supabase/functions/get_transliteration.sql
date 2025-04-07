
-- Function to get a transliteration from the database
CREATE OR REPLACE FUNCTION public.get_transliteration(original_text_param TEXT, language_param TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result_text TEXT;
BEGIN
  SELECT transliterated_text INTO result_text
  FROM public.transliterations
  WHERE original_text = original_text_param AND language = language_param
  LIMIT 1;
  
  RETURN result_text;
END;
$$;
