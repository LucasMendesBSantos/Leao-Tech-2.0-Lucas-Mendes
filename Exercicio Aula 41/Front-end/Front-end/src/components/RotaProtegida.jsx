import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function RotaProtegida({ children, tipoPermitido }) {
  const { usuario, carregando } = useAuth()

  if (carregando) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner">Carregando...</div>
      </div>
    )
  }

  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  if (tipoPermitido && usuario.tipo !== tipoPermitido) {
    const destino = usuario.tipo === 'cliente' ? '/cliente' : '/funcionario'
    return <Navigate to={destino} replace />
  }

  return children
}
