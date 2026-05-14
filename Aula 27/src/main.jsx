import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { UsuariosProvider } from './context/UsuariosContext.jsx'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UsuariosProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </UsuariosProvider>
  </StrictMode>,
)