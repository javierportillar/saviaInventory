import { supabase } from '../src/supabase';
import { MENU_ITEMS } from '../src/data/menu';

async function seed() {
  const { error } = await supabase.from('menu_items').insert(MENU_ITEMS);
  if (error) console.error(error);
}
seed();
