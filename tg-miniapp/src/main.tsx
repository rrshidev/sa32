import './assets/styles/theme.css' 
import './assets/styles/globals.css'
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

const root = createRoot(document.getElementById('root')!)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// import React from 'react';
  // import { createRoot } from 'react-dom/client';
  // import App from '../../frontend/src/App';

  // declare global {
  //   interface Window {
  //     Telegram: {
  //       WebApp: any;
  //     };
  //   }
  // }

  // const root = createRoot(document.getElementById('root')!);
  // root.render(<App isTgApp={true} />);