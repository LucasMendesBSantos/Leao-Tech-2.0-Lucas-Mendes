import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [token, setToken] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUsuario = localStorage.getItem('usuario')
    if (storedToken && storedUsuario) {
      setToken(storedToken)
      setUsuario(JSON.parse(storedUsuario))
    }
    setCarregando(false)
  }, [])

  function login(dadosUsuario, dadosToken) {
    setUsuario(dadosUsuario)
    setToken(dadosToken)
    localStorage.setItem('token', dadosToken)
    localStorage.setItem('usuario', JSON.stringify(dadosUsuario))
  }

  function logout() {
    setUsuario(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
  }

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout, carregando }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
