import { useState } from 'react'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const API_URL = '/api'

export default function Login() {
  const [cpf, setCpf] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const { login, usuario } = useAuth()
  const navigate = useNavigate()

  if (usuario) {
    return <Navigate to={usuario.tipo === 'cliente' ? '/cliente' : '/funcionario'} replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    try {
      const resp = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cpf, senha }),
      })
      const dados = await resp.json()

      if (!resp.ok || dados.erro) {
        setErro(dados.erro || 'Erro ao fazer login')
        return
      }

      login(dados.usuario, dados.token)
      navigate(dados.usuario.tipo === 'cliente' ? '/cliente' : '/funcionario', { replace: true })
    } catch {
      setErro('Erro de conexão com o servidor. Verifique se o backend está rodando.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">🏦</div>
          <h1>Banco Digital</h1>
          <p>Acesse sua conta</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="cpf">CPF</label>
            <input
              id="cpf"
              type="text"
              value={cpf}
              onChange={e => setCpf(e.target.value)}
              placeholder="000.000.000-00"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              placeholder="Digite sua senha"
              required
            />
          </div>

          {erro && <div className="alerta alerta-erro">{erro}</div>}

          <button type="submit" disabled={carregando} className="btn-primary btn-block">
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="login-footer">
          Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
        </p>
      </div>
    </div>
  )
}
