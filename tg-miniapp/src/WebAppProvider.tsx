import { useEffect, useState, createContext, useContext } from 'react'
import { WebApp } from "@twa-dev/sdk"

interface TelegramContextValue {
  webApp?: WebApp
  user?: WebAppUser
}

const TelegramContext = createContext<TelegramContextValue>({})

export const TelegramWebAppProvider = ({ children }: { children: React.ReactNode }) => {
  const [webApp, setWebApp] = useState<WebApp | null>(null)

  useEffect(() => {
    const tgWebApp = window.Telegram?.WebApp
    if (tgWebApp) {
      tgWebApp.ready()
      tgWebApp.expand()
      setWebApp(tgWebApp)
    }

    return () => {
      tgWebApp?.close()
    }
  }, [])

  return (
    <TelegramContext.Provider value={{
      webApp: webApp || undefined,
      user: webApp?.initDataUnsafe?.user
    }}>
      {children}
    </TelegramContext.Provider>
  )
}

export const useTelegram = () => {
  const context = useContext(TelegramContext)
  if (!context) {
    throw new Error('useTelegram must be used within a TelegramWebAppProvider')
  }
  return context
}

// import { useEffect } from 'react';

// export const useTelegramWebApp = () => {
//   useEffect(() => {
//     const tg = window.Telegram?.WebApp;
//     tg?.expand();
//     return () => tg?.close();
//   }, []);
// };