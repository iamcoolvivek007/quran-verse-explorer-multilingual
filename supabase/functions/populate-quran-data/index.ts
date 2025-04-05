
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = "https://oyychnbxwpiiyenwmrgz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95eWNobmJ4d3BpaXllbndtcmd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NTc1MjMsImV4cCI6MjA1OTQzMzUyM30.NSQBrmhL99G8tLBSAlMkvlNuEP809FfzeXROQxM9m3o";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const EDITIONS = {
  arabic: 'quran-uthmani',
  english_transliteration: 'en.transliteration',
  english_translation: 'en.sahih',
  malayalam_translation: 'ml.abdulhameed',
  tamil_translation: 'ta.tamil'
};

// We'll also add transliteration sources
const TRANSLITERATION_URLS = {
  malayalam_transliteration: "https://quranenc.com/api/v1/translation/sura/malayalam_abdulhameed",
  tamil_transliteration: "https://quranenc.com/api/v1/translation/sura/tamil"
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get all surah info
    console.log("Fetching surah information...");
    const surahResponse = await fetch("https://api.alquran.cloud/v1/surah");
    const surahData = await surahResponse.json();
    
    if (!surahData.data || !Array.isArray(surahData.data)) {
      throw new Error("Invalid surah data format");
    }

    // Insert surah info
    for (const surah of surahData.data) {
      await supabase.from('surahs').upsert({
        number: surah.number,
        name: surah.name,
        english_name: surah.englishName,
        verses_count: surah.numberOfAyahs
      }, { onConflict: 'number' });
      
      console.log(`Added Surah ${surah.number}: ${surah.englishName}`);
    }

    // Specify which surahs to download (for demonstration, let's start with just the first few)
    const surahsToDownload = Array.from({ length: 10 }, (_, i) => i + 1);

    for (const surahNumber of surahsToDownload) {
      console.log(`Processing Surah ${surahNumber}`);

      // Fetch data for each edition
      const editionPromises = Object.entries(EDITIONS).map(async ([key, edition]) => {
        const url = `https://api.alquran.cloud/v1/surah/${surahNumber}/${edition}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          console.error(`Failed to fetch ${key} data for Surah ${surahNumber}: ${response.status}`);
          return { key, verses: [] };
        }
        
        const data = await response.json();
        
        if (!data.data || !data.data.ayahs) {
          console.error(`Invalid data format for ${key}`);
          return { key, verses: [] };
        }
        
        return { 
          key, 
          verses: data.data.ayahs.map((ayah: any) => ({
            verse: ayah.numberInSurah,
            text: ayah.text,
            audio: ayah.audio || null
          }))
        };
      });
      
      // Fetch transliterations from alternate sources
      const transliterationPromises = Object.entries(TRANSLITERATION_URLS).map(async ([key, baseUrl]) => {
        try {
          const url = `${baseUrl}/${surahNumber}`;
          const response = await fetch(url);
          
          if (!response.ok) {
            console.error(`Failed to fetch ${key} data for Surah ${surahNumber}: ${response.status}`);
            return { key, verses: [] };
          }
          
          const data = await response.json();
          
          if (!data.result || !Array.isArray(data.result)) {
            console.error(`Invalid transliteration data format for ${key}`);
            return { key, verses: [] };
          }
          
          return { 
            key, 
            verses: data.result.map((ayah: any) => ({
              verse: ayah.aya || ayah.id || 0,
              text: ayah.translation || ayah.text || ""
            }))
          };
        } catch (error) {
          console.error(`Error fetching ${key}:`, error);
          return { key, verses: [] };
        }
      });
      
      const results = await Promise.all([...editionPromises, ...transliterationPromises]);
      
      // Process and combine the results
      const verses = [];
      const arabicData = results.find(r => r.key === 'arabic')?.verses || [];
      
      for (let i = 0; i < arabicData.length; i++) {
        const verse = {
          surah_number: surahNumber,
          ayah_number: arabicData[i].verse,
          arabic: arabicData[i].text,
          audio_url: arabicData[i].audio,
          english_transliteration: results.find(r => r.key === 'english_transliteration')?.verses[i]?.text || null,
          english_translation: results.find(r => r.key === 'english_translation')?.verses[i]?.text || null,
          malayalam_translation: results.find(r => r.key === 'malayalam_translation')?.verses[i]?.text || null,
          tamil_translation: results.find(r => r.key === 'tamil_translation')?.verses[i]?.text || null,
          malayalam_transliteration: results.find(r => r.key === 'malayalam_transliteration')?.verses[i]?.text || null,
          tamil_transliteration: results.find(r => r.key === 'tamil_transliteration')?.verses[i]?.text || null
        };
        
        verses.push(verse);
      }
      
      // Insert verses in batches to avoid hitting request size limits
      const batchSize = 20;
      for (let i = 0; i < verses.length; i += batchSize) {
        const batch = verses.slice(i, i + batchSize);
        const { error } = await supabase.from('verses').upsert(batch, { onConflict: 'surah_number,ayah_number' });
        
        if (error) {
          console.error(`Error inserting verses batch for Surah ${surahNumber}:`, error);
        } else {
          console.log(`Inserted verses ${i+1} to ${Math.min(i+batchSize, verses.length)} for Surah ${surahNumber}`);
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully populated Quran data for ${surahsToDownload.length} surahs` 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error("Error in populate-quran-data function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
