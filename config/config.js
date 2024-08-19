import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://hcnmxugfejvauzjlqgrl.supabase.co";
const SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhjbm14dWdmZWp2YXV6amxxZ3JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM5ODg5NTEsImV4cCI6MjAzOTU2NDk1MX0.a7tSadK-7fAsx5L3xf6n0gBskAhoBwu4wIgXwcoelyo";


const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

export const databaseName  = "event_test";

export default supabase;