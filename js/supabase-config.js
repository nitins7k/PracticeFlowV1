// Import the Supabase client
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Replace these with your own values
const supabaseUrl = "https://yvyybwxtsgpxdfsfmqkc.supabase.co";
const supabaseAnonKey = "sb_publishable_6IMaImhAQ4OjTI-WKDCgUQ_lUYf_3MT";

// Create the client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export it for use in other files
export { supabase };