import { useAuthStore } from "../stores/auth.store";

export const useApi = () => {
    const { token } = useAuthStore();
    
    return {
      get: (url) => fetchWithAuth(url, 'GET', null, token),
      post: (url, data) => fetchWithAuth(url, 'POST', data, token),
      // другие методы
    };
  };