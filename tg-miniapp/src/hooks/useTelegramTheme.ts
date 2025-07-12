// src/hooks/useTelegramTheme.ts
import { useEffect } from 'react'

export function useTelegramTheme() {
  useEffect(() => {
    const setTheme = () => {
      if (window.Telegram?.WebApp) {
        const { colorScheme, themeParams } = window.Telegram.WebApp
        document.documentElement.style.setProperty(
          '--tg-theme-bg-color', 
          themeParams.bg_color || '#ffffff'
        )
        // Аналогично для других переменных
      }
    }
    
    setTheme()
    window.Telegram?.WebApp.onEvent('themeChanged', setTheme)
    
    return () => {
      window.Telegram?.WebApp.offEvent('themeChanged', setTheme)
    }
  }, [])
}