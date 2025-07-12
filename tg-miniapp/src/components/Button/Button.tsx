// import { useTelegram } from '@/WebAppProvider';
// import styles from '<div className="" />Button.module.css'

// export const TgButton = ({ children, onClick }) => {
//     const { themeParams } = useTelegram();
    
//     return (
//       <button className={styles.bu}
//         style={{ 
//           backgroundColor: themeParams.button_color,
//           color: themeParams.button_text_color
//         }}
//         onClick={onClick}
//       >
//         {children}
//       </button>
//     );
//   };
import styles from './Button.module.css'

export function Button({ children }) {
  return (
    <button className={styles.button}>
      {children}
    </button>
  )
}