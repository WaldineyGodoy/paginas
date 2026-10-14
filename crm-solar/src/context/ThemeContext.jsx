import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const ThemeContext = createContext({})

export function ThemeProvider({ children }) {
  const { company } = useAuth()
  const [theme, setTheme] = useState({
    primaryDark: '#eab308',
    primaryLight: '#ca8a04',
    secondary: '#1e293b',
    background: '#0f172a',
    companyDisplayName: 'CRM Solar',
    logoUrl: '',
    mode: 'dark'
  })

  useEffect(() => {
    if (!company?.id) return

    async function fetchSettings() {
      try {
        const { data, error } = await supabase
          .from('company_settings')
          .select('theme_colors, company_display_name, logo_url')
          .eq('company_id', company.id)
          .maybeSingle()

        if (error) throw error

        if (data) {
          setTheme(prev => ({
            ...prev,
            primaryDark: data.theme_colors?.primary_dark || data.theme_colors?.primary || '#eab308',
            primaryLight: data.theme_colors?.primary_light || '#ca8a04',
            secondary: data.theme_colors?.secondary || '#1e293b',
            background: data.theme_colors?.background || '#0f172a',
            companyDisplayName: data.company_display_name || company.name,
            logoUrl: data.logo_url || ''
          }))
        }
      } catch (err) {
        // Silencioso se offline
        console.warn('Configurações remotas não puderam ser carregadas (modo local/offline)')
      }
    }

    fetchSettings()
  }, [company])

  // Injetar variáveis CSS no root e alternar classe de modo
  useEffect(() => {
    const root = document.documentElement
    const activePrimary = theme.mode === 'dark' ? theme.primaryDark : theme.primaryLight
    root.style.setProperty('--primary-color', activePrimary)
    root.style.setProperty('--secondary-color', theme.secondary)
    root.style.setProperty('--bg-color', theme.background)

    if (theme.mode === 'light') {
      root.classList.add('light-mode')
      root.classList.remove('dark-mode')
    } else {
      root.classList.add('dark-mode')
      root.classList.remove('light-mode')
    }
  }, [theme])

  const toggleMode = () => {
    setTheme(prev => ({
      ...prev,
      mode: prev.mode === 'dark' ? 'light' : 'dark'
    }))
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
