import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import RotaProtegida from './components/RotaProtegida'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import PaginaCliente from './pages/PaginaCliente'
import PaginaFuncionario from './pages/PaginaFuncionario'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route
            path="/cliente"
            element={
              <RotaProtegida tipoPermitido="cliente">
                <PaginaCliente />
              </RotaProtegida>
            }
          />
          <Route
            path="/funcionario"
            element={
              <RotaProtegida tipoPermitido="funcionario">
                <PaginaFuncionario />
              </RotaProtegida>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
