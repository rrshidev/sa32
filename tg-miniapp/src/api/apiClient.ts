import axios from 'axios';

const instance = axios.create({
  // Используем VITE_API_URL из .env или ngrok-туннель
  baseURL: import.meta.env.VITE_API_URL || 'https://sa32-backend.loca.lt/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use((config) => {
  // Добавляем данные Telegram WebApp если они есть
  const tgData = window.Telegram?.WebApp?.initData;
  if (tgData) {
    config.headers['X-Telegram-Init-Data'] = tgData;
    
    // Для разработки - логируем в консоль
    if (import.meta.env.DEV) {
      console.log('[API Client] Sending Telegram initData with request');
    }
  }
  
  // Добавляем заголовок для тестирования в локальной сети
  if (window.location.hostname === 'localhost') {
    config.headers['X-Local-Development'] = 'true';
  }
  
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Обработка ошибок API специально для Telegram Mini App
    if (error.response) {
      console.error(
        '[API Error]', 
        error.response.status, 
        error.response.data
      );
      
      // Можно показать ошибку через Telegram WebApp
      if (window.Telegram?.WebApp?.showAlert) {
        window.Telegram.WebApp.showAlert(
          `API Error: ${error.response.data?.message || 'Unknown error'}`
        );
      }
    } else {
      console.error('[API Network Error]', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default instance;