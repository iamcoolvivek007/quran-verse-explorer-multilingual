// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://oyychnbxwpiiyenwmrgz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95eWNobmJ4d3BpaXllbndtcmd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NTc1MjMsImV4cCI6MjA1OTQzMzUyM30.NSQBrmhL99G8tLBSAlMkvlNuEP809FfzeXROQxM9m3o";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);