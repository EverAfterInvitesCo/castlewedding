import { createClient } from '@supabase/supabase-js';

// These values are public (they are meant to be visible)
const supabaseUrl = "https://pvuszjcuvkycprbggweo.supabase.co/rest/v1/";
const supabaseAnonKey = "sb_publishable_q7mtNLl06q5E_4huRpiOpw_t6Vd7ezK";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
