import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jvlfcvgjknhhnqpdnrcl.supabase.co'
const supabaseAnonKey = 'sb_publishable_jfjfT_GKVxSYyltso5TbRg_037zzmoA'

// Fetch com tratamento de queda de rede para evitar travamento em tela branca caso o Supabase esteja offline
const safeFetch = async (url, options) => {
  try {
    return await fetch(url, options)
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'offline', message: 'Banco de dados Supabase temporariamente offline.' }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: false,
    detectSessionInUrl: false
  },
  global: {
    fetch: safeFetch
  }
})
