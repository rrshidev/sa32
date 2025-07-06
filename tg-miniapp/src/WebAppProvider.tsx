import { useEffect } from 'react';

export const useTelegramWebApp = () => {
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    tg?.expand();
    return () => tg?.close();
  }, []);
};