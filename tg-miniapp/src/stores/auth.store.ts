import { create } from 'zustand'
import apiClient from '../api/apiClient'

interface AuthStore {
  user: any | null
  token: string | null
  isAuth: boolean
  init: (tgUser: any) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuth: false,
  init: async (tgUser) => {
    if (!tgUser) return
    
    try {
      const { data } = await apiClient.post('/auth/telegram', {
        id: tgUser.id,
        first_name: tgUser.first_name,
        last_name: tgUser.last_name,
        username: tgUser.username
      })
      
      set({
        user: data.user,
        token: data.token,
        isAuth: true
      })
    } catch (error) {
      console.error('Auth error:', error)
    }
  },
  logout: () => set({ user: null, token: null, isAuth: false })
}))

// export const useAuthStore = create((set) => ({
//     user: null,
//     token: null,
//     init: async () => {
//       const tgUser = window.Telegram.WebApp.initDataUnsafe.user;
//       if (tgUser) {
//         const { data } = await apiClient.post('/auth/telegram', {
//           telegramData: window.Telegram.WebApp.initData
//         });
//         set({ user: data.user, token: data.token });
//       }
//     }
//   }));
  