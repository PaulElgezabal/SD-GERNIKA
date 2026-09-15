import { createClient } from '@supabase/supabase-js';

export const SB_URL = 'https://fdmnhkwmetprgdbpujos.supabase.co';
export const SB_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkbW5oa3dtZXRwcmdkYnB1am9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4ODI5NDEsImV4cCI6MjEwNDQ1ODk0MX0.-U2zMPs0HZ6AdOt0UB_clL1UPXA4XrXARogIaHLeiaw';

export const supabase = createClient(SB_URL, SB_KEY);
