
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.36.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch all surahs information
    console.log("Fetching surah information...");
    const surahsResponse = await fetch('https://api.alquran.cloud/v1/surah');
    
    if (!surahsResponse.ok) {
      throw new Error(`Failed to fetch surah information: ${surahsResponse.status}`);
    }
    
    const surahsData = await surahsResponse.json();
    
    // Insert surah data into the 'surahs' table
    for (const surah of surahsData.data) {
      await supabaseClient
        .from('surahs')
        .upsert({
          number: surah.number,
          name: surah.name,
          english_name: surah.englishName,
          verses_count: surah.numberOfAyahs
        }, {
          onConflict: 'number'
        });
      
      console.log(`Processed Surah ${surah.number}: ${surah.englishName}`);
      
      // Fetch verses for this surah from multiple editions
      const EDITIONS = {
        arabic: 'quran-uthmani',
        english_transliteration: 'en.transliteration',
        english_translation: 'en.sahih',
        malayalam_translation: 'ml.abdulhameed',
        tamil_translation: 'ta.tamil'
      };
      
      // Store data for each verse
      const verseData = {};
      
      for (const [key, edition] of Object.entries(EDITIONS)) {
        const url = `https://api.alquran.cloud/v1/surah/${surah.number}/${edition}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          console.error(`Failed to fetch ${key} data: status ${response.status}`);
          continue;
        }
        
        const data = await response.json();
        
        if (!data.data || !data.data.ayahs) {
          console.error(`Invalid data format for ${key}`);
          continue;
        }
        
        // Process each ayah
        data.data.ayahs.forEach((ayah: any) => {
          const verseKey = `${surah.number}-${ayah.numberInSurah}`;
          if (!verseData[verseKey]) {
            verseData[verseKey] = {
              surah_number: surah.number,
              ayah_number: ayah.numberInSurah,
              arabic: "",
              english_transliteration: null,
              english_translation: null,
              malayalam_translation: null,
              tamil_translation: null,
              malayalam_transliteration: null,
              tamil_transliteration: null,
              audio_url: null
            };
          }
          
          // Map the text to the appropriate field
          if (key === 'arabic') {
            verseData[verseKey].arabic = ayah.text;
          } else {
            verseData[verseKey][key] = ayah.text;
          }
        });
      }
      
      // Try to fetch transliterations from alternate sources
      try {
        const TRANSLITERATION_URLS = {
          malayalam_transliteration: "https://quranenc.com/api/v1/translation/sura/malayalam_abdulhameed",
          tamil_transliteration: "https://quranenc.com/api/v1/translation/sura/tamil"
        };
        
        for (const [key, baseUrl] of Object.entries(TRANSLITERATION_URLS)) {
          try {
            const url = `${baseUrl}/${surah.number}`;
            const response = await fetch(url);
            
            if (!response.ok) {
              console.error(`Failed to fetch ${key} data: status ${response.status}`);
              continue;
            }
            
            const data = await response.json();
            
            if (!data.result || !Array.isArray(data.result)) {
              console.error(`Invalid data format for ${key}`);
              continue;
            }
            
            // Process each ayah
            data.result.forEach((ayah: any) => {
              const verseNum = parseInt(ayah.aya || ayah.id || "0");
              const verseKey = `${surah.number}-${verseNum}`;
              
              if (verseData[verseKey]) {
                verseData[verseKey][key] = ayah.translation || ayah.text || "";
              }
            });
          } catch (error) {
            console.error(`Error fetching ${key}:`, error);
          }
        }
      } catch (error) {
        console.error("Error fetching transliterations:", error);
      }
      
      // Fetch audio URLs
      try {
        // Example using Everyayah API
        for (const verseKey in verseData) {
          const [surahNum, ayahNum] = verseKey.split('-').map(Number);
          const paddedSurah = surahNum.toString().padStart(3, '0');
          const paddedAyah = ayahNum.toString().padStart(3, '0');
          
          // Set audio URL
          const audioUrl = `https://everyayah.com/data/Ibrahim_Akhdar_32kbps/${paddedSurah}${paddedAyah}.mp3`;
          verseData[verseKey].audio_url = audioUrl;
        }
      } catch (error) {
        console.error("Error setting audio URLs:", error);
      }
      
      // Insert all verse data for this surah
      const versesToInsert = Object.values(verseData);
      if (versesToInsert.length > 0) {
        // Insert in chunks to avoid payload size limits
        const chunkSize = 50;
        for (let i = 0; i < versesToInsert.length; i += chunkSize) {
          const chunk = versesToInsert.slice(i, i + chunkSize);
          const { error } = await supabaseClient
            .from('verses')
            .upsert(chunk, {
              onConflict: 'surah_number,ayah_number'
            });
          
          if (error) {
            console.error(`Error inserting verses for Surah ${surah.number}, chunk ${i}:`, error);
          } else {
            console.log(`Inserted ${chunk.length} verses for Surah ${surah.number}, chunk ${i}`);
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Quran data population completed successfully" 
      }),
      { 
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
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
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  }
});
