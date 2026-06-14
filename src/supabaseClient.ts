import { createClient } from '@supabase/supabase-js';

// These values are public (they are meant to be visible)
const supabaseUrl = "https://pvuszjcuvkycprbggweo.supabase.co/rest/v1/";
const supabaseAnonKey = "sb_secret_SipsZKDRny3wJbMfI1m-5w_rN9Blc9l";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
