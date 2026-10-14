import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

// Usuário padrão de demonstração para desenvolvimento/testes locais
const DEFAULT_DEMO_USER = {
  id: 'demo-integrador-id',
  email: 'integrador@crmsolar.com.br'
}

const DEFAULT_DEMO_PROFILE = {
  full_name: 'Engenheiro Solar Pro',
  role: 'admin'
}

const DEFAULT_DEMO_COMPANY = {
  name: 'Solar Pro Engenharia',
  slug: 'solar-pro'
}

export function AuthProvider({ children }) {
  // Inicializa já com demo ou salvo em localStorage para não travar em tela branca se o Supabase estiver offline
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('crm_solar_demo_active')
    if (saved === 'false') return null
    return DEFAULT_DEMO_USER
  })
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('crm_solar_demo_active')
    if (saved === 'false') return null
    return DEFAULT_DEMO_PROFILE
  })
  const [company, setCompany] = useState(() => {
    const saved = localStorage.getItem('crm_solar_demo_active')
    if (saved === 'false') return null
    return DEFAULT_DEMO_COMPANY
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let isMounted = true

    // Tentar obter sessão real do Supabase sem travar caso dê erro de rede/offline
    supabase.auth.getSession()
      .then(({ data }) => {
        if (!isMounted) return
        const session = data?.session
        if (session?.user) {
          setUser(session.user)
          fetchUserProfile(session.user.id)
        }
      })
      .catch((err) => {
        console.warn('Aviso: Supabase remoto inacessível ou offline. Rodando em modo local:', err?.message || err)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return
      const currentUser = session?.user ?? null
      if (currentUser) {
        setUser(currentUser)
        fetchUserProfile(currentUser.id)
      }
    })

    return () => {
      isMounted = false
      authListener?.subscription?.unsubscribe?.()
    }
  }, [])

  async function fetchUserProfile(userId) {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (profileError) throw profileError

      if (profileData) {
        setProfile(profileData)
        if (profileData.company_id) {
          const { data: companyData } = await supabase
            .from('companies')
            .select('*')
            .eq('id', profileData.company_id)
            .single()
          if (companyData) setCompany(companyData)
        }
      }
    } catch (error) {
      console.warn('Erro ao buscar perfil no Supabase:', error.message)
    }
  }

  const loginDemo = () => {
    localStorage.setItem('crm_solar_demo_active', 'true')
    setUser(DEFAULT_DEMO_USER)
    setProfile(DEFAULT_DEMO_PROFILE)
    setCompany(DEFAULT_DEMO_COMPANY)
    setLoading(false)
  }

  const signOut = async () => {
    localStorage.setItem('crm_solar_demo_active', 'false')
    setUser(null)
    setProfile(null)
    setCompany(null)
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.warn('Erro ao deslogar do Supabase:', err)
    }
  }

  const value = {
    user,
    profile,
    company,
    loading,
    loginDemo,
    signOut
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
