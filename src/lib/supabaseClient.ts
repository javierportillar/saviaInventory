import { createClient } from '@supabase/supabase-js';
import type { Session } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

let establishingSession: Promise<Session | null> | null = null;
let hasLoggedMissingSession = false;

const createSupabaseSession = async (): Promise<Session | null> => {
  try {
    const serviceEmail = import.meta.env.VITE_SUPABASE_SERVICE_EMAIL;
    const servicePassword = import.meta.env.VITE_SUPABASE_SERVICE_PASSWORD;

    if (serviceEmail && servicePassword) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: serviceEmail,
        password: servicePassword,
      });
      if (error) throw error;
      return data.session ?? null;
    }

    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) throw error;
    return data.session ?? null;
  } catch (error) {
    console.warn('[supabaseClient] No se pudo establecer una sesión con Supabase.', error);
    return null;
  }
};

export const ensureSupabaseSession = async (): Promise<Session | null> => {
  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  const { data } = await supabase.auth.getSession();
  if (data.session) {
    hasLoggedMissingSession = false;
    return data.session;
  }

  if (!establishingSession) {
    establishingSession = (async () => {
      try {
        return await createSupabaseSession();
      } finally {
        establishingSession = null;
      }
    })();
  }

  const session = await establishingSession;
  if (session) {
    hasLoggedMissingSession = false;
    return session;
  }

  if (!hasLoggedMissingSession) {
    hasLoggedMissingSession = true;
    console.warn('[supabaseClient] No hay sesión activa de Supabase.');
  }
  return null;
};
