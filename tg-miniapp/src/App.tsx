import { useEffect } from 'react'
import { TelegramWebAppProvider, useTelegram } from './components/WebAppProvider'
import { useAuthStore } from './stores/auth.store'
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'

function AppContent() {
  const { webApp } = useTelegram()
  const { init, isAuth } = useAuthStore()

  useEffect(() => {
    if (webApp) {
      init(webApp.initDataUnsafe.user)
    }
  }, [webApp, init])

  return isAuth ? <HomePage /> : <AuthPage />
}

export default function App() {
  return (
    <TelegramWebAppProvider>
      <AppContent />
    </TelegramWebAppProvider>
  )
}

// import React, { useEffect } from "react";
// import { useAuthStore } from "./stores/auth.store";

//     export const App = () => {
//     const { init, isAuth } = useAuthStore();
    
//     useEffect(() => {
//       init();
//     }, []);
  
//     return (
//       <TelegramWebAppProvider>
//         {isAuth ? <AuthenticatedApp /> : <AuthScreen />}
//       </TelegramWebAppProvider>
//     );
//   };