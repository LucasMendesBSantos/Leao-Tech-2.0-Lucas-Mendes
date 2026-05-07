import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import Componente1 from './Componets/Componente1.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <><Componente1>
      
      <div className='row'>
        <div className='col-6'>
            <h1>Componente 1</h1>
        </div>
        
      </div>
      </Componente1></>
  </StrictMode>,
)
