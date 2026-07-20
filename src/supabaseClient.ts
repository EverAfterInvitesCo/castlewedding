import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://pvuszjcuvkycprbggweo.supabase.co";
const supabaseAnonKey = "sb_publishable_xPvR3HkIozZaxNLxPCIRfw_dvljpvdV";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const WEDDING_SLUG = "castlewedding";
