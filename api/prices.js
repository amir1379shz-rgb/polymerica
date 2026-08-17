import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY env vars for /api/prices');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
});

export default async function handler(req, res) {
  try {
    const { data, error } = await supabase
      .from('daily_prices')
      .select('material,grade,price_toman,unit,update_date')
      .order('update_date', { ascending: false });

    if (error) {
      console.error('supabase.daily_prices error', error);
      return res.status(502).json({ error: 'failed_to_fetch' });
    }

    return res.status(200).json(data || []);
  } catch (err) {
    console.error('api/prices error', err);
    return res.status(500).json({ error: 'internal_error' });
  }
}
