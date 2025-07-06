import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '../../frontend/src/App';

declare global {
  interface Window {
    Telegram: {
      WebApp: any;
    };
  }
}

const root = createRoot(document.getElementById('root')!);
root.render(<App isTgApp={true} />);