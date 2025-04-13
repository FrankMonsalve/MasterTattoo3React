import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// main.jsx o App.jsx
import 'primereact/resources/themes/lara-light-indigo/theme.css';  // Puedes cambiar el tema
import 'primereact/resources/primereact.min.css';                  // Estilos base de PrimeReact
import 'primeicons/primeicons.css';                                // Iconos
import 'primeflex/primeflex.css';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
